import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";

export interface IVisibilityCommandProvider {
    create(context: WidgetContext): IContextCommand;
}
