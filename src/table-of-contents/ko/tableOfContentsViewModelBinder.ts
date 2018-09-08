import { IViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsViewModel } from "./tableOfContentsViewModel";
import { TableOfContentsModel } from "../tableOfContentsModel";

export class TableOfContentsViewModelBinder implements IViewModelBinder<TableOfContentsModel, TableOfContentsViewModel> {
    public modelToViewModel(model: TableOfContentsModel, readonly: boolean, viewModel?: TableOfContentsViewModel): TableOfContentsViewModel {
        if (!viewModel) {
            viewModel = new TableOfContentsViewModel();
        }

        viewModel.title(model.title);
        viewModel.nodes(model.items);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",
            readonly: readonly,
            model: model,
            editor: "table-of-contents-editor",
            applyChanges: async (updatedModel: TableOfContentsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, readonly, viewModel);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TableOfContentsModel): boolean {
        return model instanceof TableOfContentsModel;
    }
}