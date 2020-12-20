import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CarouselRuntimelModule } from "./carousel/carousel.runtime.module";
import { MapRuntimeModule } from "./map";
import { SearchRuntimeModule } from "./search/search.runtime.module";


export class CoreRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new CarouselRuntimelModule());
        injector.bindModule(new MapRuntimeModule());
        injector.bindModule(new SearchRuntimeModule());
    }
}
