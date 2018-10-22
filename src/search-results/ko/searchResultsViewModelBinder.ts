import { IViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsViewModel } from "./searchResultsViewModel";
import { SearchResultsModel } from "../searchResultsModel";
import { IEventManager } from "@paperbits/common/events";


export class SearchResultsViewModelBinder implements IViewModelBinder<SearchResultsModel, SearchResultsViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public modelToViewModel(model: SearchResultsModel, viewModel?: SearchResultsViewModel): SearchResultsViewModel {
        if (!viewModel) {
            viewModel = new SearchResultsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Search results",

            model: model,
            applyChanges: (updatedModel: SearchResultsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: SearchResultsModel): boolean {
        return model instanceof SearchResultsModel;
    }
}