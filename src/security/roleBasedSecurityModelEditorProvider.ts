import { ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";
import {
    createSecurityModelEditorComponent,
    createStandardVisibilityCommand,
    IVisibilityCommandProvider,
} from "./visibilityContextCommandProvider";

export class RoleBasedSecurityModelEditorProvider implements IVisibilityCommandProvider {

    constructor(
        private readonly viewManager: ViewManager,
    ) {
    }

    create(context: WidgetContext): IContextCommand {
        return createStandardVisibilityCommand(() =>
            this.viewManager.openViewAsPopup({
                heading: `Visibility`,
                component: createSecurityModelEditorComponent(context, "role-based-security-model-editor"),
                resizing: "vertically horizontally",
            }));
    }
}
