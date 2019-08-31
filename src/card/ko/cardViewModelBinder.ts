import { CardViewModel } from "./cardViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { CardModel } from "../cardModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { CardHandlers } from "../cardHandlers";
import { IEventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class CardViewModelBinder implements ViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: CardModel, viewModel?: CardViewModel, bindingContext?: Bag<any>): Promise<CardViewModel> {
        if (!viewModel) {
            viewModel = new CardViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            widgetViewModels.push(widgetViewModel);
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Card"));
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles));
        }

        viewModel.widgets(widgetViewModels);

        if (!viewModel["widgetBinding"]) {
            const binding: IWidgetBinding<CardModel> = {
                name: "card",
                displayName: "Card",
                readonly: bindingContext ? bindingContext.readonly : false,
                flow: "inline",
                model: model,
                editor: "card-editor",
                handler: CardHandlers,
                applyChanges: (changes) => {
                    Object.assign(model, changes);
                    this.modelToViewModel(model, viewModel, bindingContext);
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            };

            viewModel["widgetBinding"] = binding;
        }

        return viewModel;
    }

    public canHandleModel(model: CardModel): boolean {
        return model instanceof CardModel;
    }
}