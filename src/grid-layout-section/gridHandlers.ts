import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";


export class GridHandlers implements IWidgetHandler {
    public getContextCommands(): IContextCommandSet {
        const contextualCommands: IContextCommandSet = {
            hoverCommands: null,
            deleteCommand: null,
            selectCommands: null
        };
        return contextualCommands;
    }
}