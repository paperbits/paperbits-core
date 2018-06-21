import * as ko from "knockout";
import { IWidgetFactoryResult } from '@paperbits/common/editing';
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { IWidgetOrder } from "@paperbits/common/editing";

export class DropBucketItem {
    public title: string | KnockoutObservable<string>;
    public description: string;
    public previewUrl: KnockoutObservable<string>;
    public thumbnailUrl: KnockoutObservable<string>;
    public widgetOrder: KnockoutObservable<IWidgetOrder>;
    public uploadables: KnockoutObservableArray<File | string>;
    public uploadablesPending: Promise<any>;
    public widgetFactoryResult: IWidgetFactoryResult;
    public background: KnockoutObservable<BackgroundModel>;

    constructor() {
        this.title = null;
        this.description = null;
        this.previewUrl = ko.observable<string>();
        this.thumbnailUrl = ko.observable<string>();
        this.uploadables = ko.observableArray<File | string>();
        this.widgetOrder = ko.observable<IWidgetOrder>();

        this.background = ko.computed<BackgroundModel>(() => {
            const background = new BackgroundModel();
            background.sourceUrl = this.thumbnailUrl();

            return background;
        });
    }
}