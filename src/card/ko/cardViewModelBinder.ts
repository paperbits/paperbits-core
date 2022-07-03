import { CardViewModel } from "./cardViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { CardModel } from "../cardModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { WidgetRegistry } from "@paperbits/common/editing/widgetRegistry";

export class CardViewModelBinder implements ViewModelBinder<CardModel, CardViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetRegistry: WidgetRegistry
    ) { }

    public async modelToViewModel(model: CardModel, viewModel?: CardViewModel, bindingContext?: Bag<any>): Promise<CardViewModel> {
        const promises = model.widgets.map(widgetModel => {
            const definition = this.widgetRegistry.getWidgetDefinitionForModel(widgetModel);

            if (definition) {
                const binding = this.widgetRegistry.createWidgetBinding(definition, widgetModel, bindingContext);
                return binding;
            }

            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            return widgetViewModelBinder.createWidgetBinding
                ? widgetViewModelBinder.createWidgetBinding<CardViewModel>(widgetModel, bindingContext)
                : widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
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