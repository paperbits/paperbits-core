import { IContextCommandSet, ViewManager, Icons, View } from "@paperbits/common/ui";
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
                    controlType: "toolbox-button",
                    displayName: "Edit carousel",
                    callback: () => this.viewManager.openWidgetEditor(context.parentBinding)
                },
                {
                    controlType: "toolbox-splitter"
                },
                {
                    tooltip: "Slide settings",
                    displayName: context.binding.displayName,
                    callback: () => this.viewManager.openWidgetEditor(context.binding),
                    controlType: "toolbox-button"
                },
                {
                    tooltip: "Select slide",
                    iconClass: "paperbits-icon paperbits-small-down",
                    controlType: "toolbox-dropdown",
                    component: {
                        name: "carousel-item-selector",
                        params: {
                            activeCarouselItemModel: context.model,
                            carouselItemModels: context.parentBinding.model.carouselItems,
                            onSelect: (item: CarouselItemModel): void => {
                                const index = context.parentBinding.model.carouselItems.indexOf(item);
                                context.parentBinding["setActiveItem"](index);
                                this.viewManager.clearContextualCommands();
                            },
                            onCreate: (): void => {
                                context.parentModel["carouselItems"].push(new CarouselItemModel());

                                const index = context.parentBinding.model.carouselItems.length - 1;

                                context.parentBinding.applyChanges();
                                context.parentBinding["setActiveItem"](index);

                                this.viewManager.clearContextualCommands();
                                this.eventManager.dispatchEvent(Events.ContentUpdate);
                            }
                        }
                    }
                },
                // {
                //     controlType: "toolbox-button",
                //     tooltip: "Edit styles",
                //     iconClass: Icons.palette,
                //     callback: () => {
                //         const view: View = {
                //             heading: "Carousel styles",
                //             component: {
                //                 name: "style-editor",
                //                 params: {
                //                     // elementStyle: componentVariation,
                //                     // baseComponentKey: componentStyleDefinition.baseComponentKey,
                //                     // plugins: componentStyleDefinition.plugins,
                //                     // onUpdate: (): void => {
                //                     //     binding.applyChanges(binding.model);
                //                     // }
                //                 }
                //             },
                //             resize: "vertically horizontally"
                //         };

                //         this.viewManager.openViewAsPopup(view);
                //     }
                // },
                {
                    controlType: "toolbox-splitter"
                },
                {
                    controlType: "toolbox-button",
                    tooltip: "Switch to parent",
                    iconClass: "paperbits-icon paperbits-enlarge-vertical",
                    callback: () => context.gridItem.getParent().getParent().select(),
                }
                // {
                //     tooltip: "Help",
                //     iconClass: "paperbits-icon paperbits-c-question",
                //     callback: () => {
                //         const view: View = {
                //             heading: "Help center",
                //             component: {
                //                 name: "help-center",
                //                 params: {
                //                     articleKey: "popups",
                //                 }
                //             },
                //             resize: {
                //                 directions: "vertically horizontally",
                //                 initialWidth: 500,
                //                 initialHeight: 700
                //             },
                //             scrollable: false
                //         };

                //         this.viewManager.openViewAsPopup(view);
                //     },
                //     controlType: "toolbox-button"
                // }
            ]
        };

        if (context.parentModel["carouselItems"].length > 1) {
            contextualEditor.deleteCommand = {
                controlType: "toolbox-button",
                tooltip: "Delete slide",
                callback: () => {
                    let index = context.parentModel["carouselItems"].indexOf(context.model) - 1;
                    context.parentModel["carouselItems"].remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);

                    if (index < 0) {
                        index = 0;
                    }

                    context.parentBinding["setActiveItem"](index);
                }
            };
        }
        else {
            const carouselParentBinding = context.gridItem.getParent().getParent().binding;
            const carouselParentModel = carouselParentBinding.model;
            const carouselModel = context.gridItem.getParent().binding.model;

            contextualEditor.deleteCommand = {
                controlType: "toolbox-button",
                tooltip: "Delete carousel",
                callback: () => {
                    carouselParentModel.widgets.remove(carouselModel);
                    carouselParentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            };
        }


        if (context.model.widgets.length === 0) {
            contextualEditor.hoverCommands.push({
                controlType: "toolbox-button",
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