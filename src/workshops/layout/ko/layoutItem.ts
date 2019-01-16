import * as ko from "knockout";
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";

export class LayoutItem {
    public contentKey?: string;

    public key: string;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public permalinkTemplate: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(layout: LayoutContract) {
        this.contentKey = layout.contentKey;

        this.key = layout.key;
        this.title = ko.observable<string>(layout.title);
        this.description = ko.observable<string>(layout.description);
        this.permalinkTemplate = ko.observable<string>(layout.permalinkTemplate);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toLayout(): LayoutContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            permalinkTemplate: this.permalinkTemplate(),
            contentKey: this.contentKey
        };
    }
}