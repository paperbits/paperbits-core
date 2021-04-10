import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { NavbarModel } from "./navbarModel";

export class NavbarHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "navbar",
            displayName: "Navigation bar",
            iconClass: "paperbits-icon paperbits-menu-34",
            requires: ["html", "js"],
            createModel: async () => {
                return new NavbarModel();
            }
        };

        return widgetOrder;
    }
}