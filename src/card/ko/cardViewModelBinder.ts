import { Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { CardModel } from "../cardModel";
import { CardViewModel } from "./cardViewModel";


export class CardViewModelBinder implements ViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    public stateToIntance(state: any, componentInstance: CardViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.widgets(state.widgets)
    }

    public async modelToState(model: CardModel, state: any, bindingContext: Bag<any>): Promise<void> {
        const promises = model.widgets.map(widgetModel => {
            const definition = this.widgetService.getWidgetDefinitionForModel(widgetModel);

            if (definition) {
                const bindingPromise = this.widgetService.createWidgetBinding(definition, widgetModel, bindingContext);
                return bindingPromise;
            }

            // legacy binding resolution
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const bindingPromise = widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
            return bindingPromise;
        });

        const widgetViewModels = await Promise.all(promises);

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Card"));
        }

        state.widgets = widgetViewModels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}