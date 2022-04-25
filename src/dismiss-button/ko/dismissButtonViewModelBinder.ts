import { DismissButton } from "./dismissButtonViewModel";
import * as Utils from "@paperbits/common/utils";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { DismissButtonModel } from "../dismissButtonModel";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { ComponentFlow } from "@paperbits/common/editing";

export class DismissButtonViewModelBinder implements ViewModelBinder<DismissButtonModel, DismissButton>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: DismissButtonModel, viewModel?: DismissButton, bindingContext?: Bag<any>): Promise<DismissButton> {
        if (!viewModel) {
            viewModel = new DismissButton();
        }

        viewModel.label(model.label);

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
            displayName: "Dismiss button",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: ComponentFlow.Contents,
            requires: ["popup"],
            editor: "dismiss-button-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: DismissButtonModel): boolean {
        return model instanceof DismissButtonModel;
    }
}