import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { SearchRuntime } from "./ko/runtime/search-runtime";
import { StaticSearchService } from "@paperbits/common/search/staticSearchService";
import { HttpClient } from "@paperbits/common/http";
import { WebPageSearchResultsBuilder } from "@paperbits/common/search";


export class SearchRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("searchRuntime", SearchRuntime);

        const httpClient = injector.resolve<HttpClient>("httpClient");
        const searchService = new StaticSearchService(httpClient);
        searchService.registerSearchResultBuilder(new WebPageSearchResultsBuilder(httpClient));
        injector.bindInstance("searchService", searchService);
    }
}