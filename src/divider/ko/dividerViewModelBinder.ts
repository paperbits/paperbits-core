import { Divider } from "./dividerViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { DividerModel } from "../dividerModel";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class DividerViewModelBinder implements ViewModelBinder<DividerModel, Divider>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: DividerModel, viewModel?: Divider, bindingContext?: Bag<any>): Promise<Divider> {
        if (!viewModel) {
            viewModel = new Divider();
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Divider",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "block",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: DividerModel): boolean {
        return model instanceof DividerModel;
    }
}