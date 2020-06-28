import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "browser-not-supported",
    template: "<div><h1>The app does not support this version of your browser, please update or use a different browser.</h1></div>"
})
export class BrowserNotSupported {
    constructor() {
    }
}