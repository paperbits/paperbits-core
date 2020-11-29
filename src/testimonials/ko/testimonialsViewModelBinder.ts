import { TestimonialsViewModel } from "./testimonialsViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { TestimonialsModel } from "../testimonialsModel";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class TestimonialsViewModelBinder implements ViewModelBinder<TestimonialsModel, TestimonialsViewModel>  {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: TestimonialsModel, viewModel?: TestimonialsViewModel, bindingContext?: Bag<any>): Promise<TestimonialsViewModel> {
        if (!viewModel) {
            viewModel = new TestimonialsViewModel();
        }

        viewModel.textContent(model.textContent);
        viewModel.allStarsCount(model.allStarsCount);
        viewModel.starsCount(model.starsCount);
        viewModel.author(model.author);
        viewModel.authorTitle(model.authorTitle);

        viewModel["widgetBinding"] = {
            displayName: "Testimonials",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: "block",
            draggable: true,
            editor: "testimonials-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TestimonialsModel): boolean {
        return model instanceof TestimonialsModel;
    }
}
