import { Contract } from "@paperbits/common";

export interface Auth0LoginContract extends Contract {
    successRedirectUrl?: string;
    domain: string;
    clientID: string;
    redirectUri: string;
    audience: string;
    responseType: string;
    scope: string;
    leeway?: number;
    realm?: string;
    googleConnectionName?: string;
    githubConnectionName?: string;
}