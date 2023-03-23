import * as Utils from "@paperbits/common/utils";
import parallel from "await-parallel-limit";
import {
    IPublisher,
    HtmlPage,
    HtmlPagePublisher,
    SitemapBuilder,
    SearchIndexBuilder
} from "@paperbits/common/publishing";
import { normalizePermalink } from "@paperbits/common/permalinks/utils";
import { maxParallelPublisingTasks } from "@paperbits/common/constants";
import { IBlobStorage, Query } from "@paperbits/common/persistence";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { ISiteService, SiteSettingsContract } from "@paperbits/common/sites";
import { Logger } from "@paperbits/common/logging";
import { ILocaleService, LocaleModel } from "@paperbits/common/localization";
import { IMediaService } from "@paperbits/common/media";
import { StyleCompiler, StyleManager } from "@paperbits/common/styles";
import { StyleBuilder } from "@paperbits/styles";
import { OpenGraphType } from "@paperbits/common/publishing/openGraph";
import { MimeTypes, RegExps } from "@paperbits/common";
import { SourceLink } from "@paperbits/common/publishing/sourceLink";


const globalStylesheetPermalink = `/styles/styles.css`;
const rootHtmlPageFilePath = "/index.html";

export class PagePublisher implements IPublisher {
    private localStyleBuilder: StyleBuilder;

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
        this.localStyleBuilder = new StyleBuilder(this.outputBlobStorage);
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

    private async renderAndUpload(settings: SiteSettingsContract, faviconPermalink: string, page: PageContract, globalStylesLink: SourceLink, locale?: LocaleModel): Promise<void> {
        if (!page.permalink) {
            this.logger.trackEvent("Publishing", { message: `Skipping page "${page.title}" with no permalink specified.` });
            return;
        }

        let permalink = normalizePermalink(page.permalink);
        const isPermalinkValid = RegExps.permalink.test(permalink);

        if (!isPermalinkValid) {
            this.logger.trackEvent("Publishing", { message: `Skipping page "${page.title}" with invalid permalink: "${permalink}".` });
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

            const htmlPage: HtmlPage = {
                title: [page.title, siteTitle].join(" - "),
                description: page.description || siteDescription,
                keywords: page.keywords || siteKeywords,
                permalink: pagePermalink,
                url: pageUrl,
                siteHostName: siteHostname,
                faviconPermalink: faviconPermalink,
                locale: locale,
                styleReferences: [globalStylesLink],
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

            this.sitemapBuilder.appendPermalink(pagePermalink);
            this.searchIndexBuilder.appendHtml(pagePermalink, htmlPage.title, htmlPage.description, this.getIndexableContent(htmlContent));

            let permalink = normalizePermalink(pagePermalink);

            const isPermalinkValid = RegExps.permalink.test(permalink);

            if (!isPermalinkValid) {
                this.logger.trackEvent("Publishing", { message: `The permalink is invalid: "${permalink}". Skipping publishing.` });
                return;
            }

            permalink = `${permalink}${rootHtmlPageFilePath}`;

            const uploadPath = permalink;
            const contentBytes = Utils.stringToUnit8Array(htmlContent);

            await this.outputBlobStorage.uploadBlob(uploadPath, contentBytes, MimeTypes.textHtml);
        }
        catch (error) {
            throw new Error(`Unable to publish page "${page.title}": ${error.stack || error.message}`);
        }
    }

    private async publishNonLocalized(siteSettings: SiteSettingsContract, faviconPermalink: string, globalStylesLink: SourceLink): Promise<void> {
        const query: Query<PageContract> = Query.from<PageContract>();
        let pagesOfResults = await this.pageService.search(query);

        do {
            const tasks = [];
            const pages = pagesOfResults.value;

            for (const page of pages) {
                tasks.push(() => this.renderAndUpload(siteSettings, faviconPermalink, page, globalStylesLink));
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

    private async publishLocalized(siteSettings: SiteSettingsContract, faviconPermalink: string, globalStylesLink: SourceLink, locales: LocaleModel[]): Promise<void> {
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
                    tasks.push(() => this.renderAndUpload(siteSettings, faviconPermalink, page, globalStylesLink, requestedLocale));
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
        const signature = await this.localStyleBuilder.buildStyle(globalStylesheetPermalink, globalStyleSheet);
        const globalStylesLink: SourceLink = {
            src: globalStylesheetPermalink,
            integrity: signature
        };

        try {
            const settings = await this.siteService.getSettings<any>();
            const siteSettings: SiteSettingsContract = settings.site;
            const faviconPermalink = siteSettings?.faviconSourceKey
                ? await this.getFaviconPermalink(siteSettings.faviconSourceKey)
                : null;

            if (localizationEnabled) {
                await this.publishLocalized(siteSettings, faviconPermalink, globalStylesLink, locales);
            }
            else {
                await this.publishNonLocalized(siteSettings, faviconPermalink, globalStylesLink);
            }
        }
        catch (error) {
            throw new Error(`Unable to complete pages publishing. ${error.stack || error.message}`);
        }
    }
}
