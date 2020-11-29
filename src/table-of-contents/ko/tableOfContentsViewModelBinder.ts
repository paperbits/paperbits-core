import { ViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsViewModel } from "./tableOfContentsViewModel";
import { TableOfContentsModel } from "../tableOfContentsModel";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";
import { TableOfContentsModelBinder, TableOfContentsContract } from "..";

export class TableOfContentsViewModelBinder implements ViewModelBinder<TableOfContentsModel, TableOfContentsViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly tableOfContentsModelBinder: TableOfContentsModelBinder
    ) { }

    public async modelToViewModel(model: TableOfContentsModel, viewModel?: TableOfContentsViewModel, bindingContext?: Bag<any>): Promise<TableOfContentsViewModel> {
        if (!viewModel) {
            viewModel = new TableOfContentsViewModel();
        }

        viewModel.nodes(model.items);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "block",
            applyChanges: async (updatedModel: TableOfContentsModel) => {
                const contract: TableOfContentsContract = {
                    type: "table-of-contents",
                    navigationItemKey: updatedModel.navigationItemKey
                };

                model = await this.tableOfContentsModelBinder.contractToModel(contract, bindingContext);

                this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TableOfContentsModel): boolean {
        return model instanceof TableOfContentsModel;
    }
}