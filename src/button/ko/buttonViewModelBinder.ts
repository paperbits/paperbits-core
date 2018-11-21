import { Button } from "./buttonViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { ButtonModel } from "../buttonModel";
import { IEventManager } from "@paperbits/common/events";

export class ButtonViewModelBinder implements IViewModelBinder<ButtonModel, Button>  {
    constructor(private readonly eventManager: IEventManager) { }

    public modelToViewModel(model: ButtonModel, viewModel?: Button): Button {
        if (!viewModel) {
            viewModel = new Button();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);
        viewModel.styles(model.styles);

        viewModel["widgetBinding"] = {
            displayName: "Button",
            model: model,
            flow: "inline",
            editor: "paperbits-button-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}