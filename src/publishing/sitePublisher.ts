import * as Utils from "@paperbits/common/utils";
import { IPublisher, SitemapBuilder, SearchIndexBuilder } from "@paperbits/common/publishing";
import { Logger } from "@paperbits/common/logging";
import { IBlobStorage, ChangeCommitter } from "@paperbits/common/persistence";


export class SitePublisher implements IPublisher {
    constructor(
        private readonly publishers: IPublisher[],
        private readonly logger: Logger,
        private readonly sitemapBuilder: SitemapBuilder,
        private readonly searchIndexBuilder: SearchIndexBuilder,
        private readonly outputBlobStorage: IBlobStorage,
        private readonly changeCommitter: ChangeCommitter
    ) { }

    public async publish(): Promise<void> {
        try {
            this.logger.trackEvent("Publishing", { message: `Publishing website...` });

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
