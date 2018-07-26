
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { TestimonialsModelBinder, TestimonialsContract } from ".";
import { Contract } from "@paperbits/common";

export class TestimonialsHandlers implements IWidgetHandler {
    private readonly testimonialsModelBinder: TestimonialsModelBinder;

    constructor(testimonialsModelBinder: TestimonialsModelBinder) {
        this.testimonialsModelBinder = testimonialsModelBinder;
    }

    private async prepareWidgetOrder(config: TestimonialsContract): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "testimonials",
            displayName: "Testimonials",
            iconClass: "paperbits-favourite-31",
            createModel: async () => {
                return this.testimonialsModelBinder.contractToModel(config);
            }
        };

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const config: TestimonialsContract = {
            object: "block",
            type: "testimonials",
            textContent : "Testimonials text",
            starsCount : 5, 
            allStarsCount : 5, 
            author : "John Doe",     
            authorTitle : "CEO at Company"
        };
        return this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig());
    }
}