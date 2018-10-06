import { IViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsViewModel } from "./tableOfContentsViewModel";
import { TableOfContentsModel } from "../tableOfContentsModel";

export class TableOfContentsViewModelBinder implements IViewModelBinder<TableOfContentsModel, TableOfContentsViewModel> {
    public modelToViewModel(model: TableOfContentsModel, viewModel?: TableOfContentsViewModel): TableOfContentsViewModel {
        if (!viewModel) {
            viewModel = new TableOfContentsViewModel();
        }

        viewModel.title(model.title);
        viewModel.nodes(model.items);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",
            
            model: model,
            editor: "table-of-contents-editor",
            applyChanges: async (updatedModel: TableOfContentsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, viewModel);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: TableOfContentsModel): boolean {
        return model instanceof TableOfContentsModel;
    }
}