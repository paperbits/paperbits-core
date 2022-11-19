import "./ko/bindingHandlers.googlemap";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { MapViewModel } from "./ko";
import { MapViewModelBinder } from "./ko/mapViewModelBinder";
import { MapHandlers } from "./mapHandlers";
import { MapModel } from "./mapModel";
import { MapModelBinder } from "./mapModelBinder";


export class MapPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("map", MapViewModel);
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
    }
}