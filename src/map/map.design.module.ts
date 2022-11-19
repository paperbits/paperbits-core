import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MapEditor } from "./ko/mapEditor";
import { MapHandlers } from "./mapHandlers";
import { MapViewModel } from "./ko/mapViewModel";
import { MapModelBinder } from "./mapModelBinder";
import { MapViewModelBinder } from "./ko/mapViewModelBinder";
import { MapModel } from "./mapModel";
import { KnockoutComponentBinder } from "../ko";
import { IWidgetService } from "@paperbits/common/widgets";

export class MapDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("map", Map);
        injector.bind("mapEditor", MapEditor);
        injector.bindSingleton("mapModelBinder", MapModelBinder);
        injector.bindSingleton("mapViewModelBinder", MapViewModelBinder)
        injector.bindSingleton("mapHandler", MapHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("map", {
            modelDefinition: MapModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: MapViewModel,
            modelBinder: MapModelBinder,
            viewModelBinder: MapViewModelBinder
        });

        widgetService.registerWidgetEditor("map", {
            displayName: "Map",
            iconClass: "widget-icon widget-icon-map",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: MapEditor,
            handlerComponent: MapHandlers
        });
    }
}