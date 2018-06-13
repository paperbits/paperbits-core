import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { TestimonialsModel } from "./testimonialsModel";


export class TestimonialsModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "testimonials";
    }

    public canHandleModel(model): boolean {
        return model instanceof TestimonialsModel;
    }

    public async nodeToModel(sliderContract: Contract): Promise<TestimonialsModel> {
        return new TestimonialsModel();
    }

    public getConfig(model: any): Contract {
        let sliderContract: Contract = {
            type: "testimonials",
            object: "block",
            size: model.size,
            style: model.style
        }

        return sliderContract;
    }
}
