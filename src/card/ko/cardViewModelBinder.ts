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

    private toTitleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private getAlignmentClass(styles: Object, alignmentString: string, targetBreakpoint: string): void {
        if (!alignmentString) {
            return;
        }

        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        const x = styles["alignX"] || {};
        const y = styles["alignY"] || {};

        x[targetBreakpoint] = `utils/content/alignHorizontally${this.toTitleCase(horizontal)}`;
        y[targetBreakpoint] = `utils/content/alignVertically${this.toTitleCase(vertical)}`;

        styles["alignX"] = x;
        styles["alignY"] = y;
    }

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

        const styles = {};

        Object.assign(styles, model.styles);

        cardViewModel.widgets(widgetViewModels);

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);
            this.getAlignmentClass(styles, model.alignment.xs, "xs");
            this.getAlignmentClass(styles, model.alignment.sm, "sm");
            this.getAlignmentClass(styles, model.alignment.md, "md");
            this.getAlignmentClass(styles, model.alignment.lg, "lg");
            this.getAlignmentClass(styles, model.alignment.xl, "xl");
        }

        cardViewModel.styles(styles);

        if (!cardViewModel["widgetBinding"]) {
            const binding: IWidgetBinding = {
                name: "card",
                displayName: "Card",
                flow: "inline",
                model: model,
                editor: "card-editor",
                handler: CardHandlers,
                applyChanges: (changes) => {
                    Object.assign(model, changes);
                    this.modelToViewModel(model, cardViewModel);
                    // this.eventManager.dispatchEvent("onContentUpdate");
                }
            };

            cardViewModel["widgetBinding"] = binding;
        }

        return cardViewModel;
    }

    public canHandleModel(model: CardModel): boolean {
        return model instanceof CardModel;
    }
}