import { IViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsViewModel } from "./searchResultsViewModel";
import { SearchResultsModel } from "../searchResultsModel";


export class SearchResultsViewModelBinder implements IViewModelBinder<SearchResultsModel, SearchResultsViewModel> {
    public modelToViewModel(model: SearchResultsModel, readonly: boolean, viewModel?: SearchResultsViewModel): SearchResultsViewModel {
        if (!viewModel) {
            viewModel = new SearchResultsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Search results",
            readonly: readonly,
            model: model,
            applyChanges: async (updatedModel: SearchResultsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: SearchResultsModel): boolean {
        return model instanceof SearchResultsModel;
    }
}