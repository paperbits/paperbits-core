import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { RoleBasedSecurityModelBinder } from "@paperbits/common/security/roleBasedSecurityModelBinder";
import { RoleBasedSecuredBindingHandler } from "../ko/bindingHandlers/bindingHandlers.roleBasedSecured";

export class RoleBasedSecurityPublishModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("securityModelBinder", RoleBasedSecurityModelBinder);
        injector.bindToCollection("autostart", RoleBasedSecuredBindingHandler);
    }
}
