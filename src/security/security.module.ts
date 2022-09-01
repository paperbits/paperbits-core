import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { SecuredBindingHandler } from "../ko/bindingHandlers/bindingHandlers.secured";
import { RoleBasedSecurityModelBinder } from "@paperbits/common/security/roleBasedSecurityModelBinder";

export class SecurityModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindToCollection("autostart", SecuredBindingHandler);
        injector.bindSingleton("securityModelBinder", RoleBasedSecurityModelBinder);
    }

}
