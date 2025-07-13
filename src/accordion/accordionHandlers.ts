import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { AccordionItemModel, AccordionModel } from "./accordionModel";
import { EventManager, Events } from "@paperbits/common/events";


export class AccordionHandlers implements IWidgetHandler<AccordionModel> {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public async getWidgetModel(): Promise<AccordionModel> {
        const model = new AccordionModel();
        model.accordionItems.push(new AccordionItemModel("Item 1"));
        model.accordionItems.push(new AccordionItemModel("Item 2"));
        model.accordionItems.push(new AccordionItemModel("Item 3"));
       
        return model;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const accordionContextualEditor: IContextCommandSet = {
            hoverCommands: null,
            defaultCommand: null,
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete accordion",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            },
            selectCommands: [
                openWidgetEditorCommand(context, "Edit accordion"),
                splitter(),
                // {
                //     controlType: "toolbox-button",
                //     displayName: activeAccordion.label,
                // },
                // {
                //     tooltip: "Select accordion",
                //     iconClass: "paperbits-icon paperbits-small-down",
                //     controlType: "toolbox-dropdown",
                //     component: {
                //         name: "accordion-item-selector",
                //         params: {
                //             activeAccordionItemModel: activeAccordion,
                //             accordionItemModels: context.binding.model.accordionItems,
                //             onSelect: (item: AccordionItemModel): void => {
                //                 const index = context.binding.model.accordionItems.indexOf(item);
                //                 context.binding["setActiveItem"](index);
                //                 this.viewManager.clearContextualCommands();
                //             },
                //             onCreate: (): void => {
                //                 context.binding.model.accordionItems.push(new AccordionItemModel());

                //                 const index = context.binding.model.accordionItems.length - 1;

                //                 context.binding.applyChanges();
                //                 context.binding["setActiveItem"](index);

                //                 this.viewManager.clearContextualCommands();
                //                 this.eventManager.dispatchEvent(Events.ContentUpdate);
                //             }
                //         }
                //     }
                // },
                // {
                //     controlType: "toolbox-splitter"
                // },
                switchToParentCommand(context)]
        };

        return accordionContextualEditor;
    }
}
