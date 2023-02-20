import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";
import { IComponent } from "@paperbits/common/ui/IComponent";
import { SecurityModelEditor } from "./securityModelEditor";

export interface IVisibilityCommandProvider {
    create(context: WidgetContext): IContextCommand;
}

export function createStandardVisibilityCommand(callback: IContextCommand["callback"], overrides?: Partial<Exclude<IContextCommand, "callback">>): IContextCommand {
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

export function createSecurityModelEditorComponent(context: WidgetContext, componentSelector: string): IComponent {
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
