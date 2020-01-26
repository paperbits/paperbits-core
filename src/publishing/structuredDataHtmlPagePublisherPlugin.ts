import { ISiteService } from "@paperbits/common/sites";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { HtmlPagePublisherPlugin, HtmlPage } from "@paperbits/common/publishing";

export class StructuredDataHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(
        private readonly siteService: ISiteService,
        private readonly settingsProvider: ISettingsProvider) { }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        /* Ensure rendering structured data for home page only */
        if (page.permalink !== "/") {
            return;
        }

        let structuredDataObject =  await this.settingsProvider.getSetting<object>("structuredData");
        
        if (!structuredDataObject) {
            const settings = await this.siteService.getSiteSettings();

            structuredDataObject = {
                "@context": "http://www.schema.org",
                "@type": "Organization",
                "name": settings.site.title,
                "description": settings.site.description
            };
        }        

        const structuredDataScriptElement = document.createElement("script");
        structuredDataScriptElement.setAttribute("type", "application/ld+json");
        structuredDataScriptElement.innerHTML = JSON.stringify(structuredDataObject);
        document.head.appendChild(structuredDataScriptElement);
    }
}
