import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
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
            ]
        };

        return contextualEditor;
    }
}