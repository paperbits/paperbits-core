import * as ko from "knockout";
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";

export class LayoutItem {
    public contentKey?: string;

    public static readonly newLayoutUri = "/new-layout";

    public key: string;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public uriTemplate: KnockoutObservable<string>;
    public hasFocus: KnockoutObservable<boolean>;

    constructor(layout: LayoutContract) {
        this.contentKey = layout.contentKey;

        this.key = layout.key;
        this.title = ko.observable<string>(layout.title);
        this.description = ko.observable<string>(layout.description);
        this.uriTemplate = ko.observable<string>(layout.uriTemplate);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toLayout(): LayoutContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            uriTemplate: this.uriTemplate(),
            contentKey: this.contentKey
        };
    }
}