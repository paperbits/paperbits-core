import { IPublisher } from "@paperbits/common/publishing";

export class SitePublisher implements IPublisher {
    constructor(private readonly publishers: IPublisher[]) { }

    public async publish(): Promise<any> {
        console.info("Publishing website...");

        for (const publisher of this.publishers) {
            await publisher.publish();
        }

        console.info("Website published successfully.");
    }
}
