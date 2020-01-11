import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { SearchRuntime } from "./ko/runtime/search-runtime";


export class SearchRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("searchRuntime", SearchRuntime);
    }
}