import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { ButtonModel } from "./buttonModel";


export class ButtonHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public async getWidgetModel(): Promise<ButtonModel> {
        return new ButtonModel();
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
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
            },
            {
                controlType: "toolbox-button",
                tooltip: "Change visibility",
                iconClass: "paperbits-icon paperbits-single-02",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    const view: View = {
                        heading: `Visibility`,
                        component: {
                            name: "role-based-security-model-editor",
                            params: {
                                securityModel: context.binding.model.security,
                                onChange: (securityModel): void => {
                                    context.binding.model.security = securityModel;
                                    context.binding.applyChanges();
                                }
                            }
                        },
                        resizing: "vertically horizontally"
                    };

                    this.viewManager.openViewAsPopup(view);
                }
            }
                // {
                //     controlType: "toolbox-button",
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
}