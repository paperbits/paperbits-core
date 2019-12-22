import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Auth0LoginViewModel } from "./auth0LoginViewModel";
import { Auth0LoginModelBinder } from "../auth0LoginModelBinder";
import { Auth0LoginViewModelBinder } from "./auth0LoginViewModelBinder";


export class Auth0LoginModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("auth0Login", Auth0LoginViewModel);
        injector.bindToCollection("modelBinders", Auth0LoginModelBinder);
        injector.bindToCollection("viewModelBinders", Auth0LoginViewModelBinder);
    }
}