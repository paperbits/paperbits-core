import { Button } from "./buttonViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { EventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: ButtonModel, viewModel?: Button, bindingContext?: Bag<any>): Promise<Button> {
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
            editor: "button-editor",
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}