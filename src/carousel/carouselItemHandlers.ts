import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { SectionModel } from "../section";
import { CarouselItemModel } from "./carouselModel";


export class CarouselItemHandlers {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: [],
            selectCommands: [
                {
                    tooltip: "Carousel settings",
                    displayName: "Carousel",
                    iconClass: "paperbits-icon paperbits-edit-72",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => this.viewManager.openWidgetEditor(context.parentBinding)
                },
                {
                    tooltip: "Slide settings",
                    displayName: context.binding.displayName,
                    iconClass: "paperbits-icon paperbits-edit-72",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => this.viewManager.openWidgetEditor(context.binding),
                },
                {
                    tooltip: "Select slide",
                    iconClass: "paperbits-icon paperbits-small-down",
                    position: "top right",
                    color: "#607d8b",
                    controlType: "",
                    component: {
                        name: "carousel-item-selector",
                        params: {
                            activeCarouselItemModel: context.model,
                            carouselItemModels: context.parentBinding.model.carouselItems,
                            onSelect: (item: CarouselItemModel) => {
                                const index = context.parentBinding.model.carouselItems.indexOf(item);
                                context.parentBinding["setActiveItem"](index);
                                this.viewManager.clearContextualCommands();
                            },
                            onCreate: () => {
                                context.parentModel["carouselItems"].push(new CarouselItemModel());
                                const index = context.parentBinding.model.carouselItems.length - 1;
                                context.parentBinding.applyChanges();
                                this.viewManager.clearContextualCommands();
                                this.eventManager.dispatchEvent(Events.ContentUpdate);
                                context.parentBinding["setActiveItem"](index);
                            }
                        }
                    }
                },
                {
                    tooltip: "Switch to parent",
                    iconClass: "paperbits-icon paperbits-enlarge-vertical",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => {
                        context.gridItem.getParent().getParent().select();
                    }
                },
                {
                    tooltip: "Help",
                    iconClass: "paperbits-icon paperbits-c-question",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => {
                        // 
                    }
                }
            ]
        };

        if (context.parentModel["carouselItems"].length > 1) {
            contextualEditor.deleteCommand = {
                tooltip: "Delete slide",
                color: "#607d8b",
                callback: () => {
                    const index = context.parentModel["carouselItems"].indexOf(context.model);
                    context.parentModel["carouselItems"].remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                    context.parentBinding["setActiveItem"](index - 1);
                }
            };
        }


        if (context.model.widgets.length === 0) {
            contextualEditor.hoverCommands.push({
                color: "#607d8b",
                iconClass: "paperbits-icon paperbits-simple-add",
                position: "center",
                tooltip: "Set slide layout",
                component: {
                    name: "grid-layout-selector",
                    params: {
                        heading: "Set slide layout",
                        onSelect: (section: SectionModel) => { // TODO: Here should come Grid model
                            context.model.widgets = section.widgets;
                            context.binding.applyChanges();

                            this.viewManager.clearContextualCommands();
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                        }
                    }
                }
            });
        }

        return contextualEditor;
    }
}