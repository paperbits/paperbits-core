import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { SearchRuntime } from "./ko/runtime/search-runtime";
import { StaticSearchService } from "@paperbits/common/search/staticSearchService";


export class SearchRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("searchRuntime", SearchRuntime);
        injector.bindSingleton("searchService", StaticSearchService);
    }
}