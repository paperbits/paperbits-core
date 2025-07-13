import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { AccordionViewModel } from "./ko/accordion";
import { AccordionEditor } from "./ko/accordionEditor";
import { AccordionItemEditor } from "./ko/accordionItemEditor";
import { AccordionItemSelector } from "./ko/accordionItemSelector";
import { AccordionViewModelBinder } from "./ko/accordionViewModelBinder";
import { AccordionItemViewModel } from "./ko/accordionItemViewModel";
import { AccordionItemViewModelBinder } from "./ko/accordionItemViewModelBinder";
import { AccordionHandlers } from "./accordionHandlers";
import { AccordionItemHandlers } from "./accordionItemHandlers";
import { AccordionModelBinder } from "./accordionModelBinder";
import { AccordionItemModelBinder } from "./accordionItemModelBinder";
import { AccordionStyleHandler } from "./accordionStyleHandler";
import { AccordionModel, AccordionItemModel } from "./accordionModel";

export class AccordionDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        console.log("Registering Accordion design module...");
        // Accordion components
        injector.bind("accordion", AccordionViewModel);
        injector.bind("accordionEditor", AccordionEditor);
        injector.bindSingleton("accordionModelBinder", AccordionModelBinder);
        injector.bindSingleton("accordionViewModelBinder", AccordionViewModelBinder);
        injector.bindSingleton("accordionHandler", AccordionHandlers);

        // AccordionItem components
        injector.bind("accordionItem", AccordionItemViewModel);
        injector.bind("accordionItemEditor", AccordionItemEditor);
        injector.bind("accordionItemSelector", AccordionItemSelector);
        injector.bindSingleton("accordionItemModelBinder", AccordionItemModelBinder);
        injector.bindSingleton("accordionItemViewModelBinder", AccordionItemViewModelBinder);
        injector.bindSingleton("accordionItemHandler", AccordionItemHandlers);

        injector.bindToCollection("widgetHandlers", AccordionItemHandlers, "accordionItemHandler");
        injector.bindToCollection("styleHandlers", AccordionStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        // Register Accordion widget
        widgetService.registerWidget("accordion", {
            modelDefinition: AccordionModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionViewModel,
            modelBinder: AccordionModelBinder,
            viewModelBinder: AccordionViewModelBinder
        });

        widgetService.registerWidgetEditor("accordion", {
            displayName: "Accordion",
            iconClass: "widget-icon widget-icon-accordion",
            requires: ["js", "interaction"],
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionEditor,
            handlerComponent: AccordionHandlers
        });

        // Register AccordionItem widget
        widgetService.registerWidget("accordion-item", {
            modelDefinition: AccordionItemModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionItemViewModel,
            modelBinder: AccordionItemModelBinder,
            viewModelBinder: AccordionItemViewModelBinder
        });

        widgetService.registerWidgetEditor("accordion-item", {
            displayName: "Item",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: AccordionItemEditor,
            handlerComponent: AccordionItemHandlers,
            selectable: false,
            draggable: false
        });
    }
}
