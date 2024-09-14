import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui";
import { IVisibilityContextCommandProvider } from "./visibilityContextCommandProvider";

/**
 * Default visibility command provider. Returns null, which means that no visibility command will be displayed.
 */
export class DefaultVisibilityCommandProvider implements IVisibilityContextCommandProvider {
    public create(context: WidgetContext): IContextCommand {
        return null;
    }
}
