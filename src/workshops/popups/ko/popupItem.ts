import * as ko from "knockout";
import { PopupContract } from "@paperbits/common/popups/popupContract";
import { HyperlinkModel } from "@paperbits/common/permalinks";

/**
 * URL view model.
 */
export class PopupItem {
    public key: string;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public permalink: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public hasFocus: ko.Observable<boolean>;

    constructor(popup: PopupContract) {
        this.key = popup.key;
        this.title = ko.observable<string>(popup.title);
        this.description = ko.observable<string>(popup.description);
        this.permalink = ko.observable<string>(popup.permalink);
        this.hasFocus = ko.observable<boolean>(false);
    }

    public toContract(): PopupContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            permalink: this.permalink()
        };
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.title();
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.target = "_popup";
        hyperlinkModel.href = this.permalink();

        return hyperlinkModel;
    }
}