import * as Utils from "@paperbits/common/utils";
import { IPublisher, SitemapBuilder } from "@paperbits/common/publishing";
import { Logger } from "@paperbits/common/logging";
import { IBlobStorage } from "@paperbits/common/persistence";


export class SitePublisher implements IPublisher {
    constructor(
        private readonly publishers: IPublisher[],
        private readonly logger: Logger,
        private readonly sitemapBuilder: SitemapBuilder,
        private readonly outputBlobStorage: IBlobStorage
    ) { }

    public async publish(): Promise<void> {
        try {
            this.logger.traceEvent("Publishing website...");

            for (const publisher of this.publishers) {
                await publisher.publish();
            }

            const sitemapXml = await this.sitemapBuilder.buildSitemap();
            const contentBytes = Utils.stringToUnit8Array(sitemapXml);

            await this.outputBlobStorage.uploadBlob("sitemap.xml", contentBytes, "text/xml");

            this.logger.traceEvent("Website published successfully.");
        }
        catch (error) {
            this.logger.traceError(error, "SitePublisher");
        }
    }
}
