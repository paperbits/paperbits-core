import { PictureViewModel } from "./pictureViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { PictureModel } from "../pictureModel";

export class PictureViewModelBinder implements IViewModelBinder<PictureModel, PictureViewModel> {
    public modelToViewModel(model: PictureModel, readonly: boolean, viewModel?: PictureViewModel): PictureViewModel {
        if (!viewModel) {
            viewModel = new PictureViewModel();
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.animation(model.animation);
        viewModel.background(model.background);

        const classes = [];
        classes.push(model.layout);
        viewModel.css(classes.join(" "));

        viewModel["widgetBinding"] = {
            displayName: "Picture",
            readonly: readonly,
            model: model,
            editor: "paperbits-picture-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}