import { Auth0LoginModule } from "./auth0Login.module";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Auth0LoginEditor } from "./auth0LoginEditor";
import { Auth0LoginHandlers } from "../auth0LoginHandlers";

export class Auth0LoginEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new Auth0LoginModule());
        injector.bind("auth0LoginEditor", Auth0LoginEditor);
        injector.bindToCollection("widgetHandlers", Auth0LoginHandlers);
    }
}