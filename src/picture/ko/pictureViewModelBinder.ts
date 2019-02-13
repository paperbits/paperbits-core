import { PictureViewModel } from "./pictureViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModel } from "../pictureModel";
import { IEventManager } from "@paperbits/common/events";

export class PictureViewModelBinder implements IViewModelBinder<PictureModel, PictureViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

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
            applyChanges: (changes) => {
                Object.assign(model, changes);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}