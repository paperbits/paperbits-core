import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { AccessContextToolButton } from "../workshops/accessContextToolbutton";
import { RoleBasedSecurityModelEditor } from "../workshops/roles/ko/roleBasedSecurityModelEditor";
import { RoleBasedSecurityPublishModule } from "./roleBasedSecurity.publish.module";
import { RoleBasedSecurityModelEditorProvider } from "./roleBasedSecurityModelEditorProvider";

export class RoleBasedSecurityDesignModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindModule(new RoleBasedSecurityPublishModule());

        injector.bindSingleton("visibilityCommandProvider", RoleBasedSecurityModelEditorProvider);

        injector.bindToCollection("trayCommands", AccessContextToolButton);
        injector.bind("securityModelEditor", RoleBasedSecurityModelEditor);
    }
}
