import { Bag } from "@paperbits/common";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { StyleDefinition } from "@paperbits/common/styles";
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

    public getStyleDefinitions(): Bag<StyleDefinition> {
        return {
            button: {
                displayName: "Button",
                plugins: ["margin"],
                components: {
                    label: {
                        displayName: "Button label",
                        plugins: ["margin"],
                        defaults: {
                            typography: {
                                fontSize: 50
                            }
                        }
                    }
                }
            }
        };
    }
}