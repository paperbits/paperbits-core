import { IVisibilityCommandProvider } from "./visibilityContextCommandProvider";
import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";

export abstract class BaseVisibilityContextCommandProvider implements IVisibilityCommandProvider {

    protected tooltip?: string;

    create(context: WidgetContext): IContextCommand {
        return {
            controlType: "toolbox-button",
            tooltip: this.tooltip ?? "Change visibility",
            iconClass: "paperbits-icon paperbits-a-security",
            position: "top right",
            color: "#607d8b",
            callback: () => this.executeCommand(context),
        };
    }

    protected abstract executeCommand(context: WidgetContext): void;
}