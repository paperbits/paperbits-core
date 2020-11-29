import { Bag } from "@paperbits/common";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { EventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";
import { SearchViewModel } from "./searchViewModel";
import { SearchModel } from "../searchModel";


export class SearchViewModelBinder implements ViewModelBinder<SearchModel, SearchViewModel> {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: SearchModel, viewModel?: SearchViewModel, bindingContext?: Bag<any>): Promise<SearchViewModel> {
        if (!viewModel) {
            viewModel = new SearchViewModel();

            const binding: IWidgetBinding<SearchModel> = {
                name: "search",
                displayName: "Search website",
                readonly: bindingContext ? bindingContext.readonly : false,
                model: model,
                flow: "block",
                draggable: true,
                applyChanges: async (changes: SearchModel) => {
                    await this.modelToViewModel(model, viewModel, bindingContext);
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            };

            viewModel["widgetBinding"] = binding;
        }

        return viewModel;
    }

    public canHandleModel(model: SearchModel): boolean {
        return model instanceof SearchModel;
    }
}