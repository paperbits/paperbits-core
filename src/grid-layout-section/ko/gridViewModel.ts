import * as ko from "knockout";
import template from "./grid.html";
import { Component } from "@paperbits/common/ko/decorators";
import { WidgetViewModel } from "../../ko/widgetViewModel";

@Component({
    selector: "grid-layout-section",
    template: template,
    injectable: "gridViewModel"
})
export class GridViewModel implements WidgetViewModel {
    public cells: ko.ObservableArray<any>;
    public widgets: ko.ObservableArray<WidgetViewModel>;
    public container: ko.Observable<string>;
    public styles: ko.Observable<Object>;

    constructor() {
        this.widgets = ko.observableArray<WidgetViewModel>();
        this.container = ko.observable<string>();
        this.styles = ko.observable<Object>();
        this.cells = ko.observableArray([]);

        this.cells([
            {
                "type": "grid-cell",
                "role": "footer",
                "styles": {
                    "instance": {
                        "grid-cell": {
                            "md": {
                                "position": {
                                    "col": 1,
                                    "row": 1
                                },
                                "span": {
                                    "cols": 1,
                                    "rows": 2
                                }
                            },
                            "xs": {
                                "position": {
                                    "col": 1,
                                    "row": 1
                                },
                                "span": {
                                    "cols": 1,
                                    "rows": 1
                                }
                            }
                        }
                    },
                    // "alignment": {
                    //     "xs": "some-key"
                    // },
                    "z-index": 1
                }
            }
        ]);

        const gridStyles = {
            instance: {
                grid: {
                    rows: [
                        "20%",
                        "60%",
                        "20%"
                    ],
                    rowGap: "0",
                    cols: [
                        "20%",
                        "60%",
                        "20%"
                    ],
                    colGap: "0"
                }
            }
        };

        this.styles(gridStyles);
    }
}