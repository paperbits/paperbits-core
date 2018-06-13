import { ButtonViewModel } from "./buttonViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { ButtonModel } from "../buttonModel";

export class ButtonViewModelBinder implements IViewModelBinder<ButtonModel, ButtonViewModel>  {
    public modelToViewModel(model: ButtonModel, readonly: boolean, viewModel?: ButtonViewModel): ButtonViewModel {
        if (!viewModel) {
            viewModel = new ButtonViewModel();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);

        let classes = [];

        switch (model.style) {
            case "default":
                classes.push("btn-default");
                break;

            case "primary":
                classes.push("btn-primary");
                break;

            case "inverted":
                classes.push("btn-inverted");
                break;
        }

        switch (model.size) {
            case "small":
                classes.push("btn-sm");
                break;

            case "regular":
                break;

            case "large":
                classes.push("btn-lg");
                break;
        }

        viewModel.css(classes.join(" "));

        viewModel["widgetBinding"] = {
            displayName: "Button",
            model: model,
            editor: "paperbits-button-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}