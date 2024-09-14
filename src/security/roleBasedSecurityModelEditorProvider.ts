import { ViewManager, IContextCommand, IComponent } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { IVisibilityContextCommandProvider } from "./visibilityContextCommandProvider";
import { SecurityModelEditor } from "./securityModelEditor";

export class RoleBasedSecurityModelEditorProvider implements IVisibilityContextCommandProvider {
    constructor(private readonly viewManager: ViewManager) { }

    private createStandardVisibilityCommand(callback: IContextCommand["callback"], overrides?: Partial<Exclude<IContextCommand, "callback">>): IContextCommand {
        return {
            controlType: "toolbox-button",
            tooltip: "Change access",
            iconClass: "paperbits-icon paperbits-a-security",
            position: "top right",
            color: "#607d8b",
            ...overrides,
            callback,
        };
    }
    
    private createSecurityModelEditorComponent(context: WidgetContext, componentSelector: string): IComponent {
        const securityModelEditorParams: SecurityModelEditor = {
            securityModel: context.binding.model.security,
            onChange: (securityModel): void => {
                context.binding.model.security = securityModel;
                context.binding.applyChanges(context.model);
            },
        };
        return {
            name: componentSelector,
            params: securityModelEditorParams,
        };
    }

    public create(context: WidgetContext): IContextCommand {
        return this.createStandardVisibilityCommand(() =>
            this.viewManager.openViewAsPopup({
                heading: `Access control`,
                component: this.createSecurityModelEditorComponent(context, "role-based-security-model-editor"),
                resizing: "vertically horizontally",
            }));
    }
}
