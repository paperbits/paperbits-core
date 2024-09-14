import { WidgetContext } from "@paperbits/common/editing";
import { IContextCommand } from "@paperbits/common/ui";

/**
 * Provider for visibility context command. Using widget context, it determines whether visibility command 
 * should be displayed for the given widget.
 */
export interface IVisibilityContextCommandProvider {
    /**
     * Creates a visibility command for the given widget context.
     * @param context Widget context.
     */
    create(context: WidgetContext): IContextCommand;
}