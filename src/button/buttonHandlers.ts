import { Bag } from "@paperbits/common";
import { IWidgetOrder, IWidgetHandler, WidgetContext, WidgetBinding, ComponentFlow } from "@paperbits/common/editing";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { ButtonModel } from "./buttonModel";

// ???
import { Button } from "./ko/button";


export class ButtonHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "button",
            displayName: "Button",
            iconClass: "widget-icon widget-icon-button",
            requires: [],
            createModel: async () => {
                return new ButtonModel();
            }
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: [{
                controlType: "toolbox-button",
                displayName: "Edit button",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                controlType: "toolbox-splitter"
            },
            {
                controlType: "toolbox-button",
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                callback: () => context.gridItem.getParent().select(),
            }
                // {
                //     tooltip: "Help",
                //     iconClass: "paperbits-icon paperbits-c-question",
                //     position: "top right",
                //     color: "#607d8b",
                //     callback: () => {
                //         // 
                //     }
                // }
            ],
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete widget",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                }
            }
        };

        return contextualEditor;
    }

    // // This is how it is now:
    // public async createWidgetBinding(model: ButtonModel, bindingContext: Bag<any>): Promise<WidgetBinding<ButtonModel, Button>> {
    //     const binding = new WidgetBinding<ButtonModel, Button>();
    //     binding.framework = "react";
    //     binding.model = model;
    //     binding.name = "click-counter";
    //     binding.displayName = "Click counter";
    //     binding.editor = "click-counter-editor";
    //     binding.readonly = false;
    //     binding.flow = ComponentFlow.Block;
    //     binding.draggable = true;
    //     binding.viewModelClass = Button;
    //     binding.applyChanges = async () => {
    //         await this.modelToViewModel(model, binding.viewModel, bindingContext);
    //         this.eventManager.dispatchEvent("onContentUpdate");
    //     };
    //     binding.onCreate = async () => {
    //         await this.modelToViewModel(model, binding.viewModel, bindingContext);
    //     };
    //     binding.onDispose = async () => {
    //         if (model.styles?.instance) {
    //             bindingContext.styleManager.removeStyleSheet(model.styles.instance.key);
    //         }
    //     };

    //     return binding;
    // }

    // // This is what we want to have:

    // public async createWidgetBinding2(model: ButtonModel, bindingContext: Bag<any>): Promise<WidgetBinding<ButtonModel, Button>> {
    //     const binding = new WidgetBinding<ButtonModel, Button>();
    //     binding.framework = "react";
    //     // binding.model = model;
    //     binding.name = "click-counter";
    //     binding.displayName = "Click counter";
    //     binding.editor = "click-counter-editor";
    //     binding.readonly = false;
    //     binding.flow = ComponentFlow.Block;
    //     binding.draggable = true;
    //     binding.viewModelClass = Button;
    //     binding.applyChanges = async () => {
    //         // await this.modelToViewModel(model, binding.viewModel, bindingContext);
    //         // this.eventManager.dispatchEvent("onContentUpdate");
    //     };
    //     binding.onCreate = async () => {
    //         // await this.modelToViewModel(model, binding.viewModel, bindingContext);
    //     };
    //     binding.onDispose = async () => {
    //         // if (model.styles?.instance) {
    //         //     bindingContext.styleManager.removeStyleSheet(model.styles.instance.key);
    //         // }
    //     };

    //     return binding;
    // }
}


/**
 * Registry.registerWidgetDefinition("button", widgetDefinition);
 * Registry.registerWidgetDesignerDefinition("button", designerDefinition);
 * 
 * 
 * What about modelBinder and viewModelBinder?
 * Registry.getModelBinderFor("widgetName");
 * Registry.getViewModelBinderFor("widgetName");
 */

