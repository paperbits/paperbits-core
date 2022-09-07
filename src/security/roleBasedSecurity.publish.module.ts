import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { RoleBasedSecurityModelBinder } from "@paperbits/common/security/roleBasedSecurityModelBinder";
import { RoleBasedSecurityRuntimeModule } from "./roleBasedSecurity.runtime.module";

export class RoleBasedSecurityPublishModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindModule(new RoleBasedSecurityRuntimeModule());

        injector.bindSingleton("securityModelBinder", RoleBasedSecurityModelBinder);
    }
}
