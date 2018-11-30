import "./bindingHandlers.googlemap";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { MapViewModel } from "./mapViewModel";
import { MapModelBinder } from "../mapModelBinder";
import { MapViewModelBinder } from "./mapViewModelBinder";
import { MapService } from "../mapService";
import { IModelBinder } from "@paperbits/common/editing";

export class MapModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("mapService", MapService);
        injector.bind("map", MapViewModel);
        injector.bindToCollection("modelBinders", MapModelBinder);
        injector.bindToCollection("viewModelBinders", MapViewModelBinder);
    }
}