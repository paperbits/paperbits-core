import { CardViewModel } from "./cardViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { CardModel } from "../cardModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { CardHandlers } from "../cardHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class CardViewModelBinder implements ViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: CardModel, viewModel?: CardViewModel, bindingContext?: Bag<any>): Promise<CardViewModel> {
        if (!viewModel) {
            viewModel = new CardViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            if (widgetViewModelBinder.createWidgetBinding) {
                const binding = await widgetViewModelBinder.createWidgetBinding<any>(widgetModel, bindingContext);
                widgetViewModels.push(binding);
            }
            else {
                const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
                widgetViewModels.push(widgetViewModel);
            }
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Card"));
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel.widgets(widgetViewModels);

        if (!viewModel["widgetBinding"]) {
            const binding: IWidgetBinding<CardModel, CardViewModel> = {
                name: "card",
                displayName: "Card",
                readonly: bindingContext ? bindingContext.readonly : false,
                flow: ComponentFlow.Inline,
                model: model,
                draggable: true,
                editor: "card-editor",
                handler: CardHandlers,
                applyChanges: async () => {
                    await this.modelToViewModel(model, viewModel, bindingContext);
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
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