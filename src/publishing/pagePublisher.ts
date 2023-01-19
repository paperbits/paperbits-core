import * as Utils from "@paperbits/common/utils";
import parallel from "await-parallel-limit";
import template from "./page.html";
import {
    IPublisher,
    HtmlPage,
    HtmlPagePublisher,
    SitemapBuilder,
    SearchIndexBuilder
} from "@paperbits/common/publishing";
import { validateAndNormalizePermalink } from "@paperbits/common/permalinks/utils";
import { maxParallelPublisingTasks } from "@paperbits/common/constants";
import { IBlobStorage, Query } from "@paperbits/common/persistence";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { ISiteService, SiteSettingsContract } from "@paperbits/common/sites";
import { Logger } from "@paperbits/common/logging";
import { ILocaleService, LocaleModel } from "@paperbits/common/localization";
import { IMediaService } from "@paperbits/common/media";
import { StyleCompiler, StyleManager } from "@paperbits/common/styles";
import { LocalStyleBuilder } from "@paperbits/styles";
import { OpenGraphType } from "@paperbits/common/publishing/openGraph";
import { MimeTypes } from "@paperbits/common";


const globalStylesheetPermalink = `/styles/styles.css`;
const localStylesheetFilePath = `/styles.css`;
const rootHtmlPageFilePath = "/index.html";

export class PagePublisher implements IPublisher {
    private localStyleBuilder: LocalStyleBuilder;

    constructor(
        protected readonly pageService: IPageService,
        protected readonly siteService: ISiteService,
        protected readonly mediaService: IMediaService,
        protected readonly outputBlobStorage: IBlobStorage,
        protected readonly htmlPagePublisher: HtmlPagePublisher,
        protected readonly styleCompiler: StyleCompiler,
        protected readonly localeService: ILocaleService,
        protected readonly sitemapBuilder: SitemapBuilder,
        protected readonly searchIndexBuilder: SearchIndexBuilder,
        protected readonly logger: Logger
    ) {
        this.localStyleBuilder = new LocalStyleBuilder(this.outputBlobStorage);
    }

    public async renderPage(page: HtmlPage): Promise<string> {
        try {
            const htmlContent = await this.htmlPagePublisher.renderHtml(page);
            return htmlContent;
        }
        catch (error) {
            throw new Error(`Unable to render page "${page.title}": ${error.stack || error.message}`);
        }
    }

    private async getFaviconPermalink(faviconSourceKey: string): Promise<string> {
        try {
            const media = await this.mediaService.getMediaByKey(faviconSourceKey);
            return media?.permalink;
        }
        catch (error) {
            this.logger.trackEvent("Publishing", { message: "Could not retrieve favicon." });
        }
    }

    private getIndexableContent(html: string): string {
        return html;

        // const regex = /<main.*>([\s\S]*)<\/main>/g;
        // const match = regex.exec(html);

        // if (!match || match.length < 1) {
        //     return null;
        // }

        // const mainContent = match[1];
        // return mainContent;
    }

    private async renderAndUpload(settings: SiteSettingsContract, faviconPermalink: string, page: PageContract, locale?: LocaleModel): Promise<void> {
        if (!page.permalink) {
            this.logger.trackEvent("Publishing", { message: `Skipping page with no permalink specified: "${page.title}".` });
            return;
        }

        this.logger.trackEvent("Publishing", { message: `Publishing page ${page.title}${locale ? ` (${locale.code})` : ""}...` });

        try {
            const siteAuthor = settings?.author;
            const siteTitle = settings?.title;
            const siteDescription = settings?.description;
            const siteKeywords = settings?.keywords;
            const siteHostname = settings?.hostname;
            const localePrefix = locale ? `/${locale.code}` : "";
            const pagePermalink = `${localePrefix}${page.permalink}`;
            const pageContent = await this.pageService.getPageContent(page.key, locale?.code);
            const pageUrl = siteHostname
                ? `https://${siteHostname}${pagePermalink}`
                : pagePermalink;

            const styleManager = new StyleManager();
            const localStylesheetPermalink = pagePermalink === "/" // home page
                ? localStylesheetFilePath
                : `${pagePermalink}${localStylesheetFilePath}`

            const htmlPage: HtmlPage = {
                title: [page.title, siteTitle].join(" - "),
                description: page.description || siteDescription,
                keywords: page.keywords || siteKeywords,
                permalink: pagePermalink,
                url: pageUrl,
                siteHostName: siteHostname,
                faviconPermalink: faviconPermalink,
                locale: locale,
                template: template,
                styleReferences: [
                    globalStylesheetPermalink,
                    localStylesheetPermalink
                ],
                author: siteAuthor,
                socialShareData: page.socialShareData,
                openGraph: {
                    type: page.permalink === "/"
                        ? OpenGraphType.website
                        : OpenGraphType.article,
                    title: page.title || siteTitle,
                    description: page.description || siteDescription,
                    siteName: siteTitle
                },
                bindingContext: {
                    contentItemKey: page.key,
                    styleManager: styleManager,
                    navigationPath: pagePermalink,
                    locale: locale?.code,
                    template: {
                        page: {
                            value: pageContent,
                        }
                    }
                }
            };

            if (page.jsonLd) {
                let structuredData: any;

                try {
                    structuredData = JSON.parse(page.jsonLd);
                    htmlPage.linkedData = structuredData;
                }
                catch (error) {
                    this.logger.trackEvent("Publishing", { message: "Unable to parse page linked data." });
                }
            }

            const htmlContent = await this.renderPage(htmlPage);

            // Building local styles
            const styleSheets = styleManager.getAllStyleSheets();
            this.localStyleBuilder.buildLocalStyle(pagePermalink, styleSheets);

            this.sitemapBuilder.appendPermalink(pagePermalink);
            this.searchIndexBuilder.appendHtml(pagePermalink, htmlPage.title, htmlPage.description, this.getIndexableContent(htmlContent));

            let permalink = validateAndNormalizePermalink(pagePermalink);
            permalink = `${permalink}${rootHtmlPageFilePath}`;

            const uploadPath = permalink;
            const contentBytes = Utils.stringToUnit8Array(htmlContent);

            await this.outputBlobStorage.uploadBlob(uploadPath, contentBytes, MimeTypes.textHtml);
        }
        catch (error) {
            throw new Error(`Unable to publish page "${page.title}": ${error.stack || error.message}`);
        }
    }

    private async publishNonLocalized(siteSettings: SiteSettingsContract, faviconPermalink: string): Promise<void> {
        const query: Query<PageContract> = Query.from<PageContract>();
        let pagesOfResults = await this.pageService.search(query);

        do {
            const tasks = [];
            const pages = pagesOfResults.value;

            for (const page of pages) {
                tasks.push(() => this.renderAndUpload(siteSettings, faviconPermalink, page));
            }

            await parallel(tasks, maxParallelPublisingTasks);

            if (pagesOfResults.takeNext) {
                pagesOfResults = await pagesOfResults.takeNext();
            }
            else {
                pagesOfResults = null;
            }
        }
        while (pagesOfResults);
    }

    private async publishLocalized(siteSettings: SiteSettingsContract, faviconPermalink: string, locales: LocaleModel[]): Promise<void> {
        const defaultLocale = await this.localeService.getDefaultLocaleCode();

        for (const locale of locales) {
            const requestedLocale = locale.code === defaultLocale
                ? null
                : locale;

            const query: Query<PageContract> = Query.from<PageContract>();
            let pagesOfResults = await this.pageService.search(query, requestedLocale?.code);

            do {
                const tasks = [];
                const pages = pagesOfResults.value;

                for (const page of pages) {
                    tasks.push(() => this.renderAndUpload(siteSettings, faviconPermalink, page, requestedLocale));
                }

                await parallel(tasks, maxParallelPublisingTasks);

                if (pagesOfResults.takeNext) {
                    pagesOfResults = await pagesOfResults.takeNext();
                }
                else {
                    pagesOfResults = null;
                }
            }
            while (pagesOfResults);
        }
    }

    public async publish(): Promise<void> {
        const locales = await this.localeService.getLocales();

        const localizationEnabled = locales.length > 0;
        const globalStyleSheet = await this.styleCompiler.getStyleSheet();

        // Building global styles
        this.localStyleBuilder.buildGlobalStyle(globalStyleSheet);

        try {
            const settings = await this.siteService.getSettings<any>();
            const siteSettings: SiteSettingsContract = settings.site;
            const faviconPermalink = settings?.faviconSourceKey
                ? await this.getFaviconPermalink(settings.faviconSourceKey)
                : null;

            if (localizationEnabled) {
                await this.publishLocalized(siteSettings, faviconPermalink, locales);
            }
            else {
                await this.publishNonLocalized(siteSettings, faviconPermalink);
            }
        }
        catch (error) {
            throw new Error(`Unable to complete pages publishing. ${error.stack || error.message}`);
        }
    }
}
