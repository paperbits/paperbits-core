import { TestimonialsViewModel } from "./testimonialsViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { TestimonialsModel } from "../testimonialsModel";
import { IEventManager } from "@paperbits/common/events";

export class TestimonialsViewModelBinder implements ViewModelBinder<TestimonialsModel, TestimonialsViewModel>  {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: TestimonialsModel, viewModel?: TestimonialsViewModel): Promise<TestimonialsViewModel> {
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
            model: model,
            editor: "testimonials-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TestimonialsModel): boolean {
        return model instanceof TestimonialsModel;
    }
}
