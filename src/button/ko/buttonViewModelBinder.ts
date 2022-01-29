import { Button } from "./button";
import * as Utils from "@paperbits/common/utils";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { ComponentFlow } from "@paperbits/common/editing";

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

        if (model.iconKey) {
            // TODO: Refactor
            const segments = model.iconKey.split("/");
            const name = segments[1];
            viewModel.icon(`icon icon-${Utils.camelCaseToKebabCase(name.replace("/", "-"))}`);
        }
        else {
            viewModel.icon(null);
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            name: "button",
            displayName: "Button",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: ComponentFlow.Contents,
            editor: "button-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}