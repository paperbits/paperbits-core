import * as ko from "knockout";
import { StyleModel } from "@paperbits/common/styles";
import { WidgetViewModel } from "../../ko/widgetViewModel";


export class TabPanelItemViewModel {
    public readonly styles: ko.Observable<StyleModel>;
    public readonly widgets: ko.ObservableArray<WidgetViewModel>;
    public readonly label: ko.Observable<string>;

    constructor() {
        this.widgets = ko.observableArray();
        this.styles = ko.observable<StyleModel>();
        this.label = ko.observable<string>("Tab");
    }
}
