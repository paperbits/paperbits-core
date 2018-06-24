import "./bindingHandlers.googlemap";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { MapViewModel } from "./mapViewModel";
import { MapModelBinder } from "../mapModelBinder";
import { MapViewModelBinder } from "./mapViewModelBinder";
import { MapService } from "../mapService";
import { IModelBinder } from "@paperbits/common/editing";

export class MapModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("mapService", MapService);

        injector.bind("map", MapViewModel);
        injector.bind("mapModelBinder", MapModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("mapModelBinder"));

        injector.bind("mapViewModelBinder", MapViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("mapViewModelBinder"));
    }
}