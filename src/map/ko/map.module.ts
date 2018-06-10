import "./bindingHandlers.googlemap";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { MapViewModel } from "./mapViewModel";
import { MapModelBinder } from "../mapModelBinder";
import { MapViewModelBinder } from "./mapViewModelBinder";
import { MapService } from "../mapService";

export class MapModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindSingleton("mapService", MapService);

        injector.bind("map", MapViewModel);
        injector.bind("mapModelBinder", MapModelBinder);
        this.modelBinders.push(injector.resolve("mapModelBinder"));

        injector.bind("mapViewModelBinder", MapViewModelBinder);
        this.viewModelBinders.push(injector.resolve("mapViewModelBinder"));
    }
}