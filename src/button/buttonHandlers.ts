import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { ButtonModel } from "./buttonModel";


export class ButtonHandlers implements IWidgetHandler {
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
}