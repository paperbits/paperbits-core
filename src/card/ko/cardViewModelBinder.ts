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

    public async modelToViewModel(model: CardModel, viewModel?: CardViewModel, bindingContext?: Bag<any>): Promise<CardViewModel> {
        const promises = model.widgets.map(widgetModel => {
            const definition = this.widgetService.getWidgetHandlerForModel(widgetModel);

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

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel.widgets(widgetViewModels);

        return viewModel;
    }

    public canHandleModel(model: CardModel): boolean {
        return model instanceof CardModel;
    }
}