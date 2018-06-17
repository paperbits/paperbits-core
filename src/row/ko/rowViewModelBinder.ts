import { RowViewModel } from "./rowViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { DragSession } from "@paperbits/common/ui/draggables/dragSession";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { GridHelper } from "@paperbits/common/editing";
import { RowModel } from "../rowModel";
import { ColumnViewModelBinder } from "../../column/ko/columnViewModelBinder";
import { PlaceholderViewModel } from "@paperbits/knockout/editors/placeholder";
import { ColumnModel } from "../../column/columnModel";

export class RowViewModelBinder implements IViewModelBinder<RowModel, RowViewModel> {
    constructor(
        private readonly columnViewModelBinder: ColumnViewModelBinder,
        private readonly viewManager: IViewManager
    ) {
    }

    public modelToViewModel(model: RowModel, readonly: boolean, viewModel?: RowViewModel): RowViewModel {
        if (!viewModel) {
            viewModel = new RowViewModel();
        }

        const columnViewModels = model.columns.map(columnModel => {
            return this.columnViewModelBinder.modelToViewModel(columnModel, readonly);
        });

        if (columnViewModels.length === 0) {
            columnViewModels.push(<any>new PlaceholderViewModel("Row"));
        }

        viewModel.columns(columnViewModels);

        viewModel.alignSm(model.alignSm);
        viewModel.alignMd(model.alignMd);
        viewModel.alignLg(model.alignLg);

        viewModel.justifySm(model.justifySm);
        viewModel.justifyMd(model.justifyMd);
        viewModel.justifyLg(model.justifyLg);

        const binding = {
            name: "row",
            displayName: "Row",
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            },
            onDragOver: (dragSession: DragSession): boolean => {
                return dragSession.type === "column";
            },
            onDragDrop: (dragSession: DragSession): void => {
                switch (dragSession.type) {
                    case "column":
                        model.columns.splice(dragSession.insertIndex, 0, <ColumnModel>dragSession.sourceModel);
                        break;

                    case "widget":
                        const columnToInsert = new ColumnModel();
                        columnToInsert.sizeMd = 3;
                        columnToInsert.widgets.push(dragSession.sourceModel);
                        model.columns.splice(dragSession.insertIndex, 0, columnToInsert);
                        break;
                }
                binding.applyChanges();
            },

            getContextualEditor(element: HTMLElement, half: string): IContextualEditor {
                const rowContextualEditor: IContextualEditor = {
                    element: element,
                    color: "#29c4a9",
                    hoverCommand: {
                        color: "#29c4a9",
                        position: half,
                        tooltip: "Add row",
                        component: {
                            name: "row-layout-selector",
                            params: {
                                onSelect: (newRowModel: RowModel) => {
                                    let parentElement = GridHelper.getParentElementWithModel(element);
                                    let parentModel = GridHelper.getModel(parentElement);
                                    let parentWidgetModel = GridHelper.getWidgetBinding(parentElement);
                                    let rowModel = GridHelper.getModel(element);
                                    let index = parentModel.rows.indexOf(rowModel);
        
                                    if (half === "bottom") {
                                        index++;
                                    }
        
                                    parentModel.rows.splice(index, 0, newRowModel);
                                    parentWidgetModel.applyChanges();
        
                                    this.viewManager.clearContextualEditors();
                                }
                            }
                        },
                    },
                    selectionCommands: null,
                    deleteCommand: {
                        tooltip: "Delete row",
                        color: "#29c4a9",
                        callback: () => {
                            let parentElement = GridHelper.getParentElementWithModel(element);
                            let parentModel = GridHelper.getModel(parentElement);
                            let parentBinding = GridHelper.getWidgetBinding(parentElement);
                            let rowModel = GridHelper.getModel(element);
        
                            parentModel.rows.remove(rowModel);
                            parentBinding.applyChanges();
        
                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
        
                return rowContextualEditor;
            }
        }

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}