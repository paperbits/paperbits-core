import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { DismissButtonModel } from "./dismissButtonModel";


export class DismissButtonHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "dismiss-button",
            category: "Popups",
            displayName: "Dismiss button",
            iconClass: "widget-icon widget-icon-button",
            requires: ["popup"],
            createModel: async () => {
                return new DismissButtonModel();
            }
        };

        return widgetOrder;
    }
}