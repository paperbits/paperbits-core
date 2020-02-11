import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { MenuModel } from "./menuModel";

export class MenuHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "menu",
            displayName: "Menu",
            iconClass: "paperbits-menu-34",
            requires: ["html", "js"],
            createModel: async () => new MenuModel()
        };

        return widgetOrder;
    }
}