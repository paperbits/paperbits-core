import * as ko from "knockout";
import template from "./code.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-code",
    template: template
})
export class Code {
    public lang: ko.Observable<string>;
    public code: ko.Observable<string>;
    public theme: ko.Observable<string>;
    public isEditable: ko.Observable<boolean>;

    constructor() {
        this.code = ko.observable<string>("let i = 0;");
        this.lang = ko.observable<string>("csharp");
        this.theme = ko.observable<string>("ambient");
        this.isEditable = ko.observable<boolean>(false);
    }
}