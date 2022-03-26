import { TextblockModel } from "./textblockModel";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";

export const nodeName = "paperbits-text";

export class TextblockHandlers implements IWidgetHandler {
    public async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "text-block",
            displayName: "Text block",
            iconClass: "widget-icon widget-icon-text-block",
            requires: [],
            createModel: async () => {
                return new TextblockModel([
                    {
                        type: "heading1",
                        nodes: [{ type: "text", text: "Heading" }]
                    },
                    {
                        type: "paragraph",
                        nodes: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }]
                    }
                ]);
            }
        };

        return widgetOrder;
    }

    // public getContextCommands(context: WidgetContext): IContextCommandSet {
    //     const contextualEditor: IContextCommandSet = {
    //         color: "#2b87da",
    //         hoverCommands: [],
    //         deleteCommand: null,
    //         selectCommands: [{
    //             tooltip: "Edit carousel slide",
    //             displayName: "Slide 1",
    //             iconClass: "paperbits-icon paperbits-edit-72",
    //             position: "top right",
    //             color: "#607d8b",
    //             callback: () => this.viewManager.openWidgetEditor(context.binding)
    //         },
    //         {
    //             tooltip: "Edit carousel",
    //             displayName: "Carousel",
    //             iconClass: "paperbits-icon paperbits-edit-72",
    //             position: "top right",
    //             color: "#607d8b",
    //             callback: () => this.viewManager.openWidgetEditor(context.parentBinding)
    //         },
    //         // {
    //         //     tooltip: "Switch to parent",
    //         //     iconClass: "paperbits-icon paperbits-enlarge-vertical",
    //         //     position: "top right",
    //         //     color: "#607d8b",
    //         //     callback: () => {
    //         //         context.switchToParent();
    //         //     }
    //         // },
    //         {
    //             tooltip: "Help",
    //             iconClass: "paperbits-icon paperbits-c-question",
    //             position: "top right",
    //             color: "#607d8b",
    //             callback: () => {
    //                 // 
    //             }
    //         }
    //     ]
    //     };

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}