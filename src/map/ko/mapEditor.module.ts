import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { MapEditor } from "./mapEditor";
import { MapHandlers } from "../mapHandlers";

export class MapEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mapEditor", MapEditor);
        injector.bindSingleton("mapDropHandler", MapHandlers);

        const dropHandlers: IContentDropHandler[] = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<MapHandlers>("mapDropHandler"));

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<MapHandlers>("mapDropHandler"));
    }
}