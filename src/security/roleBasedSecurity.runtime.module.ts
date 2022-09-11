import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { RoleBasedSecuredBindingHandler } from "../ko/bindingHandlers/bindingHandlers.roleBasedSecured";

export class RoleBasedSecurityRuntimeModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindToCollection("autostart", RoleBasedSecuredBindingHandler);
    }
}
