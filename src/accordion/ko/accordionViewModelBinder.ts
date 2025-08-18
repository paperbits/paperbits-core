import { AccordionViewModel } from "./accordion";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { AccordionItemModel, AccordionModel } from "../accordionModel";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { AccordionItemViewModel } from "./accordionItemViewModel";
import * as ko from "knockout";


export class AccordionViewModelBinder implements ViewModelBinder<AccordionModel, AccordionViewModel> {
    constructor(
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    public stateToInstance(state: any, componentInstance: AccordionViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.accordionItems(state.accordionItems);
    }

    public async modelToState(model: AccordionModel, state: any, bindingContext: Bag<any>): Promise<void> {
        const accordionItemViewModels = [];
        const accordionLabels = [];

        for (const [index, accordionItemModel] of model.accordionItems.entries()) {
            const definition = this.widgetService.getWidgetDefinitionForModel(accordionItemModel);

            // Create widget binding through the service
            const widgetBinding = await this.widgetService.createWidgetBinding(definition, accordionItemModel, bindingContext);

            const labelObservable = ko.observable((<any>widgetBinding).model.label || `Accordion ${index + 1}`);

            accordionItemViewModels.push(widgetBinding);
            accordionLabels.push(labelObservable)
        }

        if (accordionItemViewModels.length === 0) {
            accordionItemViewModels.push(<any>new Placeholder("Accordion"));
            accordionLabels.push("Accordion");
        }

        state.accordionItems = accordionItemViewModels;
        state.accordionLabels = accordionLabels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
        }
    }
}
