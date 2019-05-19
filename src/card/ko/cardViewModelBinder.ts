import { CardViewModel } from "./cardViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { CardModel } from "../cardModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { CardHandlers } from "../cardHandlers";
import { IEventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";

export class CardViewModelBinder implements ViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: CardModel, viewModel?: CardViewModel): Promise<CardViewModel> {
        if (!viewModel) {
            viewModel = new CardViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel);

            widgetViewModels.push(widgetViewModel);
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Card"));
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getClassNamesByStyleConfigAsync2(model.styles));
        }

        viewModel.widgets(widgetViewModels);

        if (!viewModel["widgetBinding"]) {
            const binding: IWidgetBinding = {
                name: "card",
                displayName: "Card",
                flow: "inline",
                model: model,
                editor: "card-editor",
                handler: CardHandlers,
                applyChanges: (changes) => {
                    Object.assign(model, changes);
                    this.modelToViewModel(model, viewModel);
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