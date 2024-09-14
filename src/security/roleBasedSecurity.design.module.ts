import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { RoleBasedSecurityModelBinder } from "@paperbits/common/security/roleBasedSecurityModelBinder";
import { RoleBasedSecuredBindingHandler } from "../ko/bindingHandlers/bindingHandlers.roleBasedSecured";
import { AccessContextToolButton } from "../workshops/accessContextToolbutton";
import { RoleBasedSecurityModelEditor } from "../workshops/roles/ko/roleBasedSecurityModelEditor";
import { RoleBasedSecurityModelEditorProvider } from "./roleBasedSecurityModelEditorProvider";
import { DefaultVisibilityCommandProvider } from "./defaultVisibilityCommandProvider";


export class RoleBasedSecurityDesignModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("visibilityCommandProvider", RoleBasedSecurityModelEditorProvider);
        injector.bindToCollection("trayCommands", AccessContextToolButton);
        injector.bind("securityModelEditor", RoleBasedSecurityModelEditor);
        injector.bindSingleton("securityModelBinder", RoleBasedSecurityModelBinder);
        injector.bindToCollection("autostart", RoleBasedSecuredBindingHandler);
    }
}

export class NoOpSecurityDesignModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("visibilityCommandProvider", DefaultVisibilityCommandProvider);
        injector.bind("securityModelEditor", RoleBasedSecurityModelEditor);
        injector.bindSingleton("securityModelBinder", RoleBasedSecurityModelBinder);
        injector.bindToCollection("autostart", RoleBasedSecuredBindingHandler);
    }
}