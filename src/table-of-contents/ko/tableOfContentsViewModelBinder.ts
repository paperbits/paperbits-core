import { ViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsViewModel } from "./tableOfContentsViewModel";
import { TableOfContentsModel } from "../tableOfContentsModel";
import { IEventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class TableOfContentsViewModelBinder implements ViewModelBinder<TableOfContentsModel, TableOfContentsViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: TableOfContentsModel, viewModel?: TableOfContentsViewModel, bindingContext?: Bag<any>): Promise<TableOfContentsViewModel> {
        if (!viewModel) {
            viewModel = new TableOfContentsViewModel();
        }

        viewModel.nodes(model.items);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            editor: "table-of-contents-editor",
            applyChanges: async (updatedModel: TableOfContentsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TableOfContentsModel): boolean {
        return model instanceof TableOfContentsModel;
    }
}