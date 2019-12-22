import * as ko from "knockout";
import template from "./auth0Login.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "auth0-login",
    template: template
})
export class Auth0LoginViewModel { 
    public readonly runtimeConfig: ko.Observable<string>;

    constructor() {
        this.runtimeConfig = ko.observable();
    }
}