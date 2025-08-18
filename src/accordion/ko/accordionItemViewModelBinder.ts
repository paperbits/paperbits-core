import { AccordionItemViewModel } from "./accordionItemViewModel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { AccordionItemModel } from "../accordionModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { stat } from "fs";


export class AccordionItemViewModelBinder implements ViewModelBinder<AccordionItemModel, AccordionItemViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    public stateToInstance(state: any, componentInstance: AccordionItemViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.label(state.label);
        componentInstance.widgets(state.widgets);
    }

    public async modelToState(model: AccordionItemModel, state: any, bindingContext: Bag<any>): Promise<void> {
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
            widgetViewModels.push(new Placeholder("Content"));
        }

        state.label = model.label || "Content";
        state.widgets = widgetViewModels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}
