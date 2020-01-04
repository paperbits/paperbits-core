import * as ko from "knockout";
import template from "./auth0LoginEditor.html";
import { Auth0LoginModel } from "../auth0LoginModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { WidgetEditor } from "@paperbits/common/widgets";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "auth0-login-editor",
    template: template
})
export class Auth0LoginEditor implements WidgetEditor<Auth0LoginModel> {
    public readonly successRedirectUrl: ko.Observable<string>;
    public readonly domain: ko.Observable<string>;
    public readonly clientID: ko.Observable<string>;
    public readonly redirectUri: ko.Observable<string>;
    public readonly audience: ko.Observable<string>;
    public readonly realm?: ko.Observable<string>;
    public readonly googleConnectionName?: ko.Observable<string>;
    public readonly githubConnectionName?: ko.Observable<string>;
    public readonly responseType: ko.Observable<string>;
    public readonly scope: ko.Observable<string>;

    constructor() {
        this.successRedirectUrl = ko.observable<string>();
        this.domain = ko.observable<string>();
        this.clientID = ko.observable<string>();
        this.redirectUri = ko.observable<string>();
        this.audience = ko.observable<string>();
        this.realm = ko.observable<string>();
        this.googleConnectionName = ko.observable<string>();
        this.githubConnectionName = ko.observable<string>();
        this.responseType = ko.observable<string>();
        this.scope = ko.observable<string>();
    }
    @Param()
    public model: Auth0LoginModel;

    @Event()
    public onChange: (model: Auth0LoginModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.successRedirectUrl(this.model.successRedirectUrl);
        this.domain(this.model.domain);
        this.clientID(this.model.clientID);
        this.redirectUri(this.model.redirectUri);
        this.audience(this.model.audience);
        this.realm(this.model.realm);
        this.googleConnectionName(this.model.googleConnectionName);
        this.githubConnectionName(this.model.githubConnectionName);
        this.responseType(this.model.responseType);
        this.scope(this.model.scope);

        this.successRedirectUrl.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.domain.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.clientID.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.redirectUri.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.audience.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.realm.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.googleConnectionName.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.githubConnectionName.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.responseType.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);
        this.scope.extend(ChangeRateLimit).subscribe(this.onControlsUpdate);        
    }

    private onControlsUpdate(): void {
        this.model.successRedirectUrl = this.successRedirectUrl();
        this.model.domain = this.domain();
        this.model.clientID = this.clientID();
        this.model.redirectUri = this.redirectUri();
        this.model.audience = this.audience();
        this.model.realm = this.realm();
        this.model.googleConnectionName = this.googleConnectionName();
        this.model.githubConnectionName = this.githubConnectionName();
        this.model.responseType = this.responseType();
        this.model.scope = this.scope();

        this.onChange(this.model);
    }
}