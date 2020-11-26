import "./bindingHandlers.googlemap";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MapViewModel } from "./mapViewModel";
import { MapModelBinder } from "../mapModelBinder";
import { MapViewModelBinder } from "./mapViewModelBinder";


export class MapPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("map", MapViewModel);
        injector.bindToCollection("modelBinders", MapModelBinder);
        injector.bindToCollection("viewModelBinders", MapViewModelBinder);
    }
}