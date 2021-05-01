import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { CarouselItemModel, CarouselModel } from "./carouselModel";
import { EventManager } from "@paperbits/common/events";


export class CarouselHandlers {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "carousel",
            displayName: "Carousel",
            iconClass: "widget-icon widget-icon-carousel",
            requires: ["js", "interaction"],
            createModel: async () => {
                const model = new CarouselModel();
                model.carouselItems.push(new CarouselItemModel());
                model.carouselItems.push(new CarouselItemModel());
                model.carouselItems.push(new CarouselItemModel());
                model.showControls = true;
                model.showIndicators = true;

                model.styles.instance = {
                    size: {
                        xl: {
                            minHeight: 300
                        },
                        lg: {
                            minHeight: 300
                        },
                        md: {
                            minHeight: 300
                        },
                        sm: {
                            minHeight: 300
                        },
                        xs: {
                            minHeight: 300
                        }
                    }
                };

                return model;
            }
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const carouselContextualEditor: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: null,
            deleteCommand: {
                tooltip: "Delete carousel",
                color: "#607d8b",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            selectCommands: [{
                tooltip: "Add slide",
                iconClass: "paperbits-icon paperbits-circle-add",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    context.model["carouselItems"].push(new CarouselItemModel());
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            {
                tooltip: "Edit carousel",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: "#607d8b",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: "#607d8b",
                callback: () => context.switchToParent()
            }]
        };

        return carouselContextualEditor;
    }
}