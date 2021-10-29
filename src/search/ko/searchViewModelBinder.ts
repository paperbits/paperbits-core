import { Bag } from "@paperbits/common";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { EventManager, Events } from "@paperbits/common/events";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { SearchViewModel } from "./searchViewModel";
import { SearchModel } from "../searchModel";


export class SearchViewModelBinder implements ViewModelBinder<SearchModel, SearchViewModel> {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: SearchModel, viewModel?: SearchViewModel, bindingContext?: Bag<any>): Promise<SearchViewModel> {
        if (!viewModel) {
            viewModel = new SearchViewModel();

            const binding: IWidgetBinding<SearchModel, SearchViewModel> = {
                name: "search",
                displayName: "Search website",
                readonly: bindingContext ? bindingContext.readonly : false,
                model: model,
                flow: ComponentFlow.Block,
                draggable: true,
                applyChanges: async () => {
                    await this.modelToViewModel(model, viewModel, bindingContext);
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
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