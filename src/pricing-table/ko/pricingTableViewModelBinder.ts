import { PricingTableViewModel } from "./pricingTableViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PricingTableModel } from "../pricingTableModel";
import { IEventManager } from "@paperbits/common/events";

export class PricingTableViewModelBinder implements IViewModelBinder<PricingTableModel, PricingTableViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public modelToViewModel(model: PricingTableModel, viewModel?: PricingTableViewModel): PricingTableViewModel {
        if (!viewModel) {
            viewModel = new PricingTableViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Pricing table",

            model: model,
            editor: "pricing-table-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: PricingTableModel): boolean {
        return model instanceof PricingTableModel;
    }
}