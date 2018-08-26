import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { PricingTableModel } from "./pricingTableModel";

export class PricingTableHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const pricingTableOrder: IWidgetOrder = {
            name: "pricingTable",
            displayName: "Pricing table",
            createModel: async () => {
                return new PricingTableModel();
            }
        };

        return pricingTableOrder;
    }
}