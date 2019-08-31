import { ViewModelBinder } from "@paperbits/common/widgets";
import { SearchResultsViewModel } from "./searchResultsViewModel";
import { SearchResultsModel } from "../searchResultsModel";
import { IEventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";


export class SearchResultsViewModelBinder implements ViewModelBinder<SearchResultsModel, SearchResultsViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: SearchResultsModel, viewModel?: SearchResultsViewModel, bindingContext?: Bag<any>): Promise<SearchResultsViewModel> {
        if (!viewModel) {
            viewModel = new SearchResultsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Search results",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            applyChanges: (updatedModel: SearchResultsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: SearchResultsModel): boolean {
        return model instanceof SearchResultsModel;
    }
}