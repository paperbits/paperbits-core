import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { AccessContextToolButton } from "../workshops/accessContextToolbutton";
import { RoleBasedSecurityModelEditor } from "../workshops/roles/ko/roleBasedSecurityModelEditor";
import { SecurityModule } from "./security.module";
import { RoleBaseSecurityModelEditorProvider } from "./roleBaseSecurityModelEditorProvider";

export class SecurityDesignModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindModule(new SecurityModule());

        injector.bindToCollection("trayCommands", AccessContextToolButton);
        injector.bind("securityModelEditor", RoleBasedSecurityModelEditor);
        injector.bind("visibilityCommandProvider", RoleBaseSecurityModelEditorProvider);
    }
}
