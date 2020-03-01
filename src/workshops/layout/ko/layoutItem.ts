import * as ko from "knockout";
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";

export class LayoutItem {
    public contentKey?: string;

    public key: string;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public permalinkTemplate: ko.Observable<string>;
    public hasFocus: ko.Observable<boolean>;

    constructor(layout: LayoutContract) {
        this.contentKey = layout.contentKey;

        this.key = layout.key;
        this.title = ko.observable<string>(layout.title);
        this.description = ko.observable<string>(layout.description);
        this.permalinkTemplate = ko.observable<string>(layout.permalinkTemplate);

        this.hasFocus = ko.observable<boolean>(false);
    }

    public toContract(): LayoutContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            permalinkTemplate: this.permalinkTemplate(),
            contentKey: this.contentKey
        };
    }
}