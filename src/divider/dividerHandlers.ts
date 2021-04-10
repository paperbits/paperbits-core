import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { DividerModel } from "./dividerModel";


export class DividerHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "divider",
            displayName: "Divider",
            iconClass: "paperbits-icon paperbits-divider-2",
            requires: [],
            createModel: async () => {
                return new DividerModel();
            }
        };

        return widgetOrder;
    }
}