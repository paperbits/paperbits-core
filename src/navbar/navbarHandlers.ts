import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { NavbarModel } from "./navbarModel";

export class NavbarHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "navbar",
            displayName: "Navigation bar",
            iconClass: "paperbits-menu-34",
            requires: ["scripts"],
            createModel: async () => {
                const model = new NavbarModel();
                model.rootKey = "main";
                return model;
            }
        };

        return widgetOrder;
    }
}