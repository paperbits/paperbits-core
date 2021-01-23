import * as ko from "knockout";
import { IWidgetOrder, IWidgetFactoryResult } from "@paperbits/common/editing";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class DropBucketItem {
    public title: string | ko.Observable<string>;
    public description: string;
    public previewUrl: ko.Observable<string>;
    public thumbnailUrl: ko.Observable<string>;
    public widgetOrder: ko.Observable<IWidgetOrder>;
    public uploadables: ko.ObservableArray<File | string>;
    public uploadablesPending: Promise<any>;
    public widgetFactoryResult: IWidgetFactoryResult<any, any>;
    public background: ko.Computed<BackgroundModel>;

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