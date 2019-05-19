import { ViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsViewModel } from "./tableOfContentsViewModel";
import { TableOfContentsModel } from "../tableOfContentsModel";
import { IEventManager } from "@paperbits/common/events";

export class TableOfContentsViewModelBinder implements ViewModelBinder<TableOfContentsModel, TableOfContentsViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: TableOfContentsModel, viewModel?: TableOfContentsViewModel): Promise<TableOfContentsViewModel> {
        if (!viewModel) {
            viewModel = new TableOfContentsViewModel();
        }

        viewModel.title(model.title);
        viewModel.nodes(model.items);
        viewModel.maxHeading(model.maxHeading);

        viewModel["widgetBinding"] = {
            displayName: "Table of contents",

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