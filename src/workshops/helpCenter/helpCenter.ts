import * as ko from "knockout";
import template from "./helpCenter.html";
import { Component, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { HelpService } from "@paperbits/common/tutorials/helpService";


@Component({
    selector: "help-center",
    template: template
})
export class HelpCenter {
    public readonly helpContent: ko.Observable<string>;

    constructor(private readonly helpService: HelpService) {
        this.articleKey = ko.observable();
        this.helpContent = ko.observable();
    }

    @Param()
    public articleKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        const helpContent = await this.helpService.getHelpContent(this.articleKey());
        this.helpContent(helpContent);
    }
}