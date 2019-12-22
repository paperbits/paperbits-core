import { IModelBinder } from "@paperbits/common/editing";
import { Auth0LoginModel } from "./auth0LoginModel";
import { Contract } from "@paperbits/common";
import { Auth0LoginContract } from "./auth0LoginContract";

export class Auth0LoginModelBinder implements IModelBinder<Auth0LoginModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "auth0-login";
    }

    public canHandleModel(model: Auth0LoginModel): boolean {
        return model instanceof Auth0LoginModel;
    }

    public async contractToModel(contract: Auth0LoginContract): Promise<Auth0LoginModel> {
        return new Auth0LoginModel(contract);
    }

    public modelToContract(model: Auth0LoginModel): Contract {
        const contract: Auth0LoginContract = {
            type: "auth0-login",
            successRedirectUrl: model.successRedirectUrl,
            domain: model.domain,
            clientID: model.clientID,
            redirectUri: model.redirectUri,
            audience: model.audience,
            realm: model.realm,
            googleConnectionName: model.googleConnectionName,
            githubConnectionName: model.githubConnectionName,
            responseType: model.responseType,
            scope: model.scope,
            leeway: model.leeway
        };

        return contract;
    }
}
