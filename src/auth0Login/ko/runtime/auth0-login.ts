import * as ko from "knockout";
import * as auth0 from "auth0-js";
import template from "./auth0-login.html";
import { Component, RuntimeComponent, Param, OnMounted } from "@paperbits/common/ko/decorators";

@RuntimeComponent({
    selector: "auth0-login-runtime"
})
@Component({
    selector: "auth0-login-runtime",
    template: template
})
export class Auth0Login {
    @Param()
    public successRedirectUrl: ko.Observable<string>;
    
    @Param()
    public domain: ko.Observable<string>;

    @Param()
    public clientID: ko.Observable<string>;

    @Param()
    public redirectUri: ko.Observable<string>;

    @Param()
    public audience: ko.Observable<string>;

    @Param()
    public realm: ko.Observable<string>;

    @Param()
    public googleConnectionName: ko.Observable<string>;

    @Param()
    public githubConnectionName: ko.Observable<string>;

    @Param()
    public responseType: ko.Observable<string>;

    @Param()
    public scope: ko.Observable<string>;

    @Param()
    public leeway: ko.Observable<number>;

    public readonly isBasicEnabled: ko.Observable<boolean>;
    public readonly isGoogleEnabled: ko.Observable<boolean>;
    public readonly isGithubEnabled: ko.Observable<boolean>;
    public readonly email: ko.Observable<string>;
    public readonly password: ko.Observable<string>;
    public readonly canLogin: ko.PureComputed<boolean>;

    private authConfig: any;
    private  auth0: auth0.WebAuth;

    constructor() {
        this.isBasicEnabled = ko.observable<boolean>();
        this.isGoogleEnabled = ko.observable<boolean>();
        this.isGithubEnabled = ko.observable<boolean>();
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
        this.leeway = ko.observable<number>();

        this.email = ko.observable<string>();
        this.password = ko.observable<string>();

        this.canLogin = ko.pureComputed<boolean>(function(): boolean {
            return this.domain() && this.clientID() && this.redirectUri() && this.audience() && this.responseType() && this.scope() && this.leeway();
        }, this);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.isBasicEnabled(!!this.realm());
        this.isGoogleEnabled(!!this.googleConnectionName());
        this.isGithubEnabled(!!this.githubConnectionName());
        this.init();
    }

    public init(): void {
        if (this.auth0) {
            return;
        }

        this.authConfig = {
            domain: this.domain(),
            clientID: this.clientID(),
            redirectUri: this.redirectUri(),
            audience: this.audience(),
            realm: this.realm(),
            responseType: this.responseType(),
            scope: this.scope(),
            leeway: this.leeway()
        };

        this.auth0 = new auth0.WebAuth(this.authConfig);
        this.handleAuthentication();
    }

    public login(): void {
        this.init();
        this.auth0.login({
            username: this.email(),
            password: this.password()
        }, (err, authResult) => {
            if (err) {
                console.log(err);
                alert(`Error: ${err.errorDescription}. Check the console for further details.`);
                return;
            }
        });
    }

    public loginWithGoogle(): void {
        this.init();
        this.auth0.authorize({
            connection: this.googleConnectionName()
        });
    }

    public loginWithGithub(): void {
        this.init();
        this.auth0.authorize({
            connection: this.githubConnectionName()
        });
    }

    private handleAuthentication(): void {
        if (window.location.hash && window.location.hash.indexOf("access_token=") !== -1) {
            this.auth0.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    console.log(authResult);
                    const redirectUrl = this.successRedirectUrl();
                    if (redirectUrl) {
                        const params = new URLSearchParams();
                        params.append("domain", this.domain());
                        params.append("clientID", this.clientID());
                        params.append("audience", this.audience());
                        params.append("responseType", this.responseType());
                        params.append("scope", this.scope());
                        params.append("leeway", this.leeway().toString());
                        
                        window.location.replace(`${redirectUrl}?${params.toString()}`);
                    }
                } else if (err) {
                    console.log(err);
                }
            });
        }
    }
}