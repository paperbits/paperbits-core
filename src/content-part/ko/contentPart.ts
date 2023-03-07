import * as ko from "knockout";
import template from "./contentPart.html";
import { Component } from "@paperbits/common/ko/decorators";


@Component({
    selector: "content-part",
    template: template
})
export class ContentPart {
    public title: ko.Observable<string>;
    public widgetBinding: any;

    constructor(title: string) {
        this.title = ko.observable<string>(title);
        this.widgetBinding = { displayName: title  };
    }
}
