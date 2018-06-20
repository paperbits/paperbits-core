import { TextblockModel } from "@paperbits/common/widgets/textblock/textblockModel";
import { IWidgetOrder } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";

export const nodeName = "paperbits-text";

export class TextblockHandlers implements IWidgetHandler {
    public async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "text-block",
            displayName: "Text block",
            iconClass: "paperbits-edit-2",
            createModel: async () => {
                return new TextblockModel({
                    "nodes": [{
                        "leaves": [{
                            "object": "leaf",
                            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        }],
                        "object": "block",
                        "type": "paragraph"
                    }]
                });
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}