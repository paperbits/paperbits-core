import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";
import { GridModel } from "./gridModel";


export class GridHandlers implements IWidgetHandler<GridModel> {
    public getContextCommands(): IContextCommandSet {
        const contextualCommands: IContextCommandSet = {
            hoverCommands: null,
            deleteCommand: null,
            selectCommands: null
        };
        return contextualCommands;
    }
}