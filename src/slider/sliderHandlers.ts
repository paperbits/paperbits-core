import { IWidgetOrder } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common/contract";
import { SliderModelBinder } from "./sliderModelBinder";

export class SliderHandlers implements IWidgetHandler {
    private readonly sliderModelBinder: SliderModelBinder;

    constructor(sliderModelBinder: SliderModelBinder) {
        this.sliderModelBinder = sliderModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "slider",
            displayName: "Slider",
            requires: ["scripts"],
            createModel: async () => {
                return await this.sliderModelBinder.contractToModel(config);
            }
        };

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const config: Contract = {
            object: "block",
            type: "slider",
            label: "Slider",
            style: "default"
        };
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}