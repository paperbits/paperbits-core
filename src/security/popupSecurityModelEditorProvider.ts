import { View, ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { BaseVisibilityContextCommandProvider } from "./baseVisibilityContextCommandProvider";
import { SecurityModelEditor } from "./securityModelEditor";

export abstract class PopupSecurityModelEditorProvider extends BaseVisibilityContextCommandProvider {

    protected constructor(
        private readonly viewManager: ViewManager,
        private readonly componentSelector: string,
    ) {
        super();
    }

    protected executeCommand(context: WidgetContext) {
        const securityModelEditorParams: SecurityModelEditor = {
            securityModel: context.binding.model.security,
            onChange: (securityModel): void => {
                context.binding.model.security = securityModel;
                context.binding.applyChanges(context.model);
            },
        };
        const view: View = {
            heading: `Visibility`,
            component: {
                name: this.componentSelector,
                params: securityModelEditorParams,
            },
            resizing: "vertically horizontally",
        };
        this.viewManager.openViewAsPopup(view);
    }
}
