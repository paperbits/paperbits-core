import { TestimonialsModel } from "./testimonialsModel";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { TestimonialsModelBinder, TestimonialsContract } from ".";

export class TestimonialsHandlers implements IWidgetHandler {
    private async prepareWidgetOrder(config: TestimonialsContract): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "testimonials",
            displayName: "Testimonials",
            iconClass: "paperbits-favourite-31",
            createModel: async () => {
                return new TestimonialsModel();
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