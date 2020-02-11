import { Button } from "./buttonViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: ButtonModel, viewModel?: Button, bindingContext?: Bag<any>): Promise<Button> {
        if (!viewModel) {
            viewModel = new Button();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);
        viewModel.roles(model.roles);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Button",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "inline",
            editor: "button-editor",
            applyChanges: async () => {
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