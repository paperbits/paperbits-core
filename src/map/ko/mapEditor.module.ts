import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { MapEditor } from "./mapEditor";
import { MapHandlers } from "../mapHandlers";

export class MapEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mapEditor", MapEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", MapHandlers, "mapHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", MapHandlers, "mapHandler");
    }
}