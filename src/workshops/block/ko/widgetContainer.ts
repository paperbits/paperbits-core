import * as ko from "knockout";
import template from "./widgetContainer.html";
import { Component, Param, OnMounted, Encapsulation } from "@paperbits/common/ko/decorators";
import { JssCompiler } from "@paperbits/styles/jssCompiler";
import { StyleCompiler } from "@paperbits/common/styles";

@Component({
    selector: "widget-container",
    template: template,
    encapsulation: Encapsulation.shadowDom
})
export class WidgetContainer {
    public widgetViewModel: ko.Observable<any>;
    public css: ko.Observable<any>;

    constructor(private readonly styleCompiler: StyleCompiler) {
        this.widgetViewModel = ko.observable<string>();
        this.css = ko.observable();
    }

    @Param()
    public widgetData: any;

    @OnMounted()
    public async initialize(): Promise<void> {
        const compiler = new JssCompiler();

        setImmediate(async () => {
            const styleSheets = this.widgetData.styleManager.getAllStyleSheets();
            const localCss = compiler.compile(...styleSheets);

            const globalStyleSheet = await this.styleCompiler.getStyleSheet();
            const globalCss = compiler.compile(globalStyleSheet);

            this.css(globalCss + " " + localCss);
        });

        this.widgetViewModel(this.widgetData.widget);
    }
}