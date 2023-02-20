import { ViewManager, IContextCommand } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import {
    createSecurityModelEditorComponent,
    createStandardVisibilityCommand,
    IVisibilityCommandProvider
} from "./visibilityContextCommandProvider";

export class RoleBasedSecurityModelEditorProvider implements IVisibilityCommandProvider {
    constructor(private readonly viewManager: ViewManager) { }

    public create(context: WidgetContext): IContextCommand {
        return createStandardVisibilityCommand(() =>
            this.viewManager.openViewAsPopup({
                heading: `Access control`,
                component: createSecurityModelEditorComponent(context, "role-based-security-model-editor"),
                resizing: "vertically horizontally",
            }));
    }
}
