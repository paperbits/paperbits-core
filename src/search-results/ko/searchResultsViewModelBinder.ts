import { ViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsViewModel } from "./searchResultsViewModel";
import { SearchResultsModel } from "../searchResultsModel";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";


export class SearchResultsViewModelBinder implements ViewModelBinder<SearchResultsModel, SearchResultsViewModel> {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: SearchResultsModel, viewModel?: SearchResultsViewModel, bindingContext?: Bag<any>): Promise<SearchResultsViewModel> {
        if (!viewModel) {
            viewModel = new SearchResultsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Search results",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            applyChanges: async (updatedModel: SearchResultsModel) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: SearchResultsModel): boolean {
        return model instanceof SearchResultsModel;
    }
}