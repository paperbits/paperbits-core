import { TestimonialsModel } from "./testimonialsModel";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";

export class TestimonialsHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "testimonials",
            displayName: "Testimonials",
            iconClass: "widget-icon widget-icon-testimonials",
            requires: ["html", "js"],
            createModel: async () => {
                const model = new TestimonialsModel();
                model.starsCount = 5;
                model.allStarsCount = 5;
                model.author = "John Doe";
                model.authorTitle = "CEO at Contoso";
                model.textContent = "Testimonials text";
                return model;
            }
        };

        return widgetOrder;
    }
}