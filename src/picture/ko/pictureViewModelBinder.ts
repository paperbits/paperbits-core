import { PictureViewModel } from "./pictureViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModel } from "../pictureModel";

export class PictureViewModelBinder implements IViewModelBinder<PictureModel, PictureViewModel> {
    public modelToViewModel(model: PictureModel, viewModel?: PictureViewModel): PictureViewModel {
        if (!viewModel) {
            viewModel = new PictureViewModel();
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout || "noframe");
        viewModel.animation(model.animation);
        viewModel.background(model.background);
        viewModel.hyperlink(model.hyperlink);
        viewModel.width(model.width);
        viewModel.height(model.height);

        viewModel["widgetBinding"] = {
            displayName: "Picture",
            
            model: model,
            editor: "paperbits-picture-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}