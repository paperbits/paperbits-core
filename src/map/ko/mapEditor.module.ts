import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { MapModule } from "./map.module";
import { MapEditor } from "./mapEditor";
import { MapHandlers } from "../mapHandlers";

export class MapEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new MapModule(this.modelBinders, this.viewModelBinders));

        injector.bind("mapEditor", MapEditor);        
        injector.bindSingleton("mapDropHandler", MapHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<MapHandlers>("mapDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<MapHandlers>("mapDropHandler"));
    }
}