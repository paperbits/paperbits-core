
import { IWidgetOrder } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { Contract } from "@paperbits/common/contract";
import { TestimonialsModelBinder } from './testimonialsModelBinder';

export class TestimonialsHandlers implements IWidgetHandler {
    private readonly testimonialsModelBinder: TestimonialsModelBinder;

    constructor(testimonialsModelBinder: TestimonialsModelBinder) {
        this.testimonialsModelBinder = testimonialsModelBinder;
    }

    private async prepareWidgetOrder(config: Contract): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "testimonials",
            displayName: "Testimonials",
            iconClass: "paperbits-favourite-31",
            createModel: async () => {
                return await this.testimonialsModelBinder.nodeToModel(config);
            }
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        let config: Contract = {
            object: "block",
            type: "testimonials",
            label: "Testimonials",
            style: "default"
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}