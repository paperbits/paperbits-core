import * as ko from "knockout";
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";

export class LayoutItem {
    public key: string;
    public contentKey?: string;
    public readonly title: ko.Observable<string>;
    public readonly description: ko.Observable<string>;
    public readonly permalinkTemplate: ko.Observable<string>;

    constructor(layout: LayoutContract) {
        this.key = layout.key;
        this.contentKey = layout.contentKey;
        this.title = ko.observable<string>(layout.title);
        this.description = ko.observable<string>(layout.description);
        this.permalinkTemplate = ko.observable<string>(layout.permalinkTemplate);
    }

    public toContract(): LayoutContract {
        return {
            key: this.key,
            contentKey: this.contentKey,
            title: this.title(),
            description: this.description(),
            permalinkTemplate: this.permalinkTemplate()
        };
    }
}