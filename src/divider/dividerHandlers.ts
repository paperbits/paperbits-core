import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { DividerModel } from "./dividerModel";


export class DividerHandlers implements IWidgetHandler<DividerModel> {
    public async getWidgetOrder(): Promise<IWidgetOrder<DividerModel>> {
        const widgetOrder: IWidgetOrder<DividerModel> = {
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