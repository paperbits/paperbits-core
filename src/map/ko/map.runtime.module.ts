import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MapRuntime } from "./runtime/map-runtime";
import { GooglmapsBindingHandler } from "./bindingHandlers.googlemap";


export class MapRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mapRuntime", MapRuntime);
        injector.bindToCollection("autostart", GooglmapsBindingHandler);
    }
}