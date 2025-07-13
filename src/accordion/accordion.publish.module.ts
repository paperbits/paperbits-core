import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { AccordionViewModel } from "./ko/accordion";
import { AccordionItemViewModel } from "./ko/accordionItemViewModel";
import { AccordionModelBinder } from "./accordionModelBinder";
import { AccordionItemModelBinder } from "./accordionItemModelBinder";
import { AccordionViewModelBinder } from "./ko/accordionViewModelBinder";
import { AccordionItemViewModelBinder } from "./ko/accordionItemViewModelBinder";
import { AccordionStyleHandler } from "./accordionStyleHandler";
import { AccordionModel, AccordionItemModel } from "./accordionModel";

export class AccordionPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("accordion", AccordionViewModel);
        injector.bind("accordionItem", AccordionItemViewModel);
        injector.bindSingleton("accordionModelBinder", AccordionModelBinder);
        injector.bindSingleton("accordionItemModelBinder", AccordionItemModelBinder);
        injector.bindSingleton("accordionViewModelBinder", AccordionViewModelBinder);
        injector.bindSingleton("accordionItemViewModelBinder", AccordionItemViewModelBinder);
        injector.bindToCollection("styleHandlers", AccordionStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("accordion", {
            modelDefinition: AccordionModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionViewModel,
            modelBinder: AccordionModelBinder,
            viewModelBinder: AccordionViewModelBinder
        });

        widgetService.registerWidget("accordion-item", {
            modelDefinition: AccordionItemModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionItemViewModel,
            modelBinder: AccordionItemModelBinder,
            viewModelBinder: AccordionItemViewModelBinder
        });
    }
}
