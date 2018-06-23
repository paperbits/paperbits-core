import { IWidgetOrder } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { NavbarModelBinder } from './navbarModelBinder';

export class NavbarHandlers implements IWidgetHandler {
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(navbarModelBinder: NavbarModelBinder) {
        this.navbarModelBinder = navbarModelBinder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "navbar",
            displayName: "Navigation bar",
            iconClass: "paperbits-menu-34",
            requires: ["scripts"],
            createWidget: () => {
                throw "Not implemented.";
            },
            createModel: async () => {
                const node = {
                    object: "block",
                    type: "navbar",
                    rootKey: "main" // TODO: This is temporary, until multiple menus support is implemented.
                };

                return await this.navbarModelBinder.nodeToModel(node);
            }
        }

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}