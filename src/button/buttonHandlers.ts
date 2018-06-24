import { IWidgetOrder } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";
import { ButtonModel } from "./buttonModel";


export class ButtonHandlers implements IWidgetHandler {
    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "button",
            displayName: "Button",
            iconClass: "paperbits-button-2",
            createModel: async () => {
                return new ButtonModel();
            }
        }

        return widgetOrder;
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}