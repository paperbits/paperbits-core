import { Auth0LoginContract } from "./auth0LoginContract";

export class Auth0LoginModel {
    public successRedirectUrl: string;
    public domain: string;
    public clientID: string;
    public redirectUri: string;
    public audience: string;
    public realm?: string;
    public googleConnectionName?: string;
    public githubConnectionName?: string;

    public responseType: string;
    public scope: string;
    public leeway?: number;

    constructor(contract?: Auth0LoginContract) {
        if (contract) {
            this.successRedirectUrl = contract.successRedirectUrl;
            this.domain = contract.domain;
            this.clientID = contract.clientID;
            this.redirectUri = contract.redirectUri;
            this.audience = contract.audience;
            this.realm = contract.realm;
            this.googleConnectionName = contract.googleConnectionName;
            this.githubConnectionName = contract.githubConnectionName;
            this.responseType = contract.responseType;
            this.scope = contract.scope;
            this.leeway = contract.leeway;
        } else {
            this.responseType = "token id_token";
            this.scope = "openid profile email user:email";
            this.leeway = 30;
        }
    }
}
