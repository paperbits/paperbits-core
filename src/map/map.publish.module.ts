import "./ko/bindingHandlers.googlemap";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MapModelBinder } from "./mapModelBinder";
import { MapViewModel } from "./ko/mapViewModel";
import { MapViewModelBinder } from "./ko/mapViewModelBinder";


export class MapPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("map", MapViewModel);
        injector.bindToCollection("modelBinders", MapModelBinder);
        injector.bindToCollection("viewModelBinders", MapViewModelBinder);
    }
}