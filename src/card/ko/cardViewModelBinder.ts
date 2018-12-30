import * as Utils from "@paperbits/common/utils";
import { CardViewModel } from "./cardViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { CardModel } from "../cardModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { CardHandlers } from "../cardHandlers";
import { IEventManager } from "@paperbits/common/events";

export class CardViewModelBinder implements IViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: CardModel, cardViewModel?: CardViewModel): CardViewModel {
        if (!cardViewModel) {
            cardViewModel = new CardViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel);

                return widgetViewModel;
            });

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Card"));
        }

        cardViewModel.widgets(widgetViewModels);

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);
            cardViewModel.alignmentXs(model.alignment.xs);
            cardViewModel.alignmentSm(model.alignment.sm);
            cardViewModel.alignmentMd(model.alignment.md);
            cardViewModel.alignmentLg(model.alignment.lg);
            cardViewModel.alignmentXl(model.alignment.xl);
        }

        cardViewModel.overflowX(model.overflowX);
        cardViewModel.overflowY(model.overflowY);

        const binding: IWidgetBinding = {
            name: "card",
            displayName: "Card",

            flow: "inline",
            model: model,
            editor: "card-editor",
            handler: CardHandlers,

            applyChanges: () => {
                this.modelToViewModel(model, cardViewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        cardViewModel["widgetBinding"] = binding;

        return cardViewModel;
    }

    public canHandleModel(model: CardModel): boolean {
        return model instanceof CardModel;
    }
}