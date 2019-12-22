import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { Auth0LoginModel } from "./auth0LoginModel";


export class Auth0LoginHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "auth0-login",
            displayName: "Auth0 login",
            requires: ["scripts"],
            iconClass: "paperbits-puzzle-10",
            createModel: async () => {
                return new Auth0LoginModel();
            }
        };

        return widgetOrder;
    }
}