import { Button } from "./buttonViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { IEventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";

export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(
        private readonly eventManager: IEventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: ButtonModel, viewModel?: Button): Promise<Button> {
        if (!viewModel) {
            viewModel = new Button();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles));
        }

        viewModel["widgetBinding"] = {
            displayName: "Button",
            model: model,
            flow: "inline",
            editor: "paperbits-button-editor",
            applyChanges: (changes) => {
                Object.assign(model, changes);
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