import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { GridCellEditor } from "./gridCellEditor";
import { IWidgetHandler } from "@paperbits/common/editing";
import { GridCellHandlers } from "../gridCellHandlers";

export class GridCellEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("gridCellEditor", GridCellEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", GridCellHandlers, "gridCellHandler");
    }
}