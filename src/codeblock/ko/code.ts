import * as ko from "knockout";
import template from "./code.html";
import { Component } from "../../ko/component";

@Component({
    selector: "paperbits-code",
    template: template
})
export class Code {
    public lang: KnockoutObservable<string>;
    public code: KnockoutObservable<string>;
    public theme: KnockoutObservable<string>;
    public isEditable: KnockoutObservable<boolean>;

    constructor() {
        this.code = ko.observable<string>("let i = 0;");
        this.lang = ko.observable<string>("csharp");
        this.theme = ko.observable<string>("ambient");
        this.isEditable = ko.observable<boolean>(false);
    }
}