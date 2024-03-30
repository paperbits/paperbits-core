import * as Utils from "@paperbits/common/utils";
import { IPublisher, SitemapBuilder } from "@paperbits/common/publishing";
import { SearchIndexBuilder } from "@paperbits/common/search";
import { Logger } from "@paperbits/common/logging";
import { IBlobStorage, ChangeCommitter } from "@paperbits/common/persistence";
import { ISettingsProvider } from "@paperbits/common/configuration";


export class SitePublisher implements IPublisher {
    constructor(
        private readonly publishers: IPublisher[],
        private readonly logger: Logger,
        private readonly sitemapBuilder: SitemapBuilder,
        private readonly searchIndexBuilder: SearchIndexBuilder,
        private readonly outputBlobStorage: IBlobStorage,
        private readonly changeCommitter: ChangeCommitter,
        private readonly settingsProvider: ISettingsProvider
    ) { }

    public async publish(): Promise<void> {
        try {
            this.logger.trackEvent("Publishing", { message: `Publishing website...` });

            const enableSuffix = await this.settingsProvider.getSetting<boolean>("features/addSuffixToStaticFiles");

            if (enableSuffix || enableSuffix === true) {
                await this.settingsProvider.setSetting("staticAssetSuffix", Utils.identifier(10));
            }

            for (const publisher of this.publishers) {
                await publisher.publish();
            }

            const sitemapXml = await this.sitemapBuilder.buildSitemap();
            const sitemapXmlBytes = Utils.stringToUnit8Array(sitemapXml);
            await this.outputBlobStorage.uploadBlob("sitemap.xml", sitemapXmlBytes, "text/xml");

            const searchIndex = await this.searchIndexBuilder.buildIndex();
            const searchIndexBytes = Utils.stringToUnit8Array(searchIndex);
            await this.outputBlobStorage.uploadBlob("search-index.json", searchIndexBytes, "application/json");

            await this.changeCommitter.commit();

            this.logger.trackEvent("Publishing", { message: `Website published successfully.` });
        }
        catch (error) {
            throw new Error(`Unable to complete publishing. ${error.stack || error.message}`);
        }
    }
}
