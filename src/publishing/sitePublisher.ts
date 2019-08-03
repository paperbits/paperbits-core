import { IPublisher } from "@paperbits/common/publishing";
import { Logger } from "@paperbits/common/logging";


export class SitePublisher implements IPublisher {
    constructor(
        private readonly publishers: IPublisher[],
        private readonly logger: Logger
    ) { }

    public async publish(): Promise<any> {
        try {
            this.logger.traceEvent("Publishing website...");

            for (const publisher of this.publishers) {
                await publisher.publish();
            }

            this.logger.traceEvent("Website published successfully.");
        }
        catch (error) {
            this.logger.traceError(error, "SitePublisher");
        }
    }
}
