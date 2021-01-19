import { TextblockModel } from "./textblockModel";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";

export const nodeName = "paperbits-text";

export class TextblockHandlers implements IWidgetHandler {
    public async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "text-block",
            displayName: "Text block",
            iconClass: "paperbits-edit-2",
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

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}