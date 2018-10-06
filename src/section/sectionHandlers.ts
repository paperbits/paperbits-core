import { IContextualEditor, IView, IViewManager } from "@paperbits/common/ui";
import { DragSession } from "@paperbits/common/ui/draggables";
import { GridHelper } from "@paperbits/common/editing";
import { SectionModel } from "./sectionModel";
import { RowModel } from "../row/rowModel";


export class SectionHandlers {
    constructor(private readonly viewManager: IViewManager) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "row";
    }

    public onDragDrop(dragSession: DragSession): void {
        switch (dragSession.type) {
            case "row":
                dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
                break;

            default:
                throw new Error(`Unknown type: ${dragSession.type}`);
        }
        dragSession.targetBinding.applyChanges();
    }

    public getContextualEditor(element: HTMLElement, half: string, placeholderElement?: HTMLElement, placeholderHalf?: string): IContextualEditor {
        const sectionContextualEditor: IContextualEditor = {
            element: element,
            color: "#2b87da",
            hoverCommand: {
                position: half,
                tooltip: "Add section",
                color: "#2b87da",
                component: {
                    name: "section-layout-selector",
                    params: {
                        onSelect: (newSectionModel: SectionModel) => {
                            let sectionElement = element;
                            let sectionHalf = half;

                            if (!sectionElement) {
                                sectionElement = placeholderElement;
                            }

                            if (!sectionHalf) {
                                sectionHalf = placeholderHalf;
                            }

                            const mainElement = GridHelper.getParentElementWithModel(sectionElement);
                            const mainModel = GridHelper.getModel(mainElement);
                            const mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                            const sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                            let index = mainModel.widgets.indexOf(sectionModel);

                            if (sectionHalf === "bottom") {
                                index++;
                            }

                            mainModel.widgets.splice(index, 0, newSectionModel);
                            mainWidgetModel.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            },
            deleteCommand: {
                tooltip: "Delete section",
                color: "#2b87da",
                callback: () => {
                    const mainElement = GridHelper.getParentElementWithModel(element);
                    const mainModel = GridHelper.getModel(mainElement);
                    const mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                    const sectionModel = GridHelper.getModel(element);

                    mainModel.widgets.remove(sectionModel);
                    mainWidgetModel.applyChanges();

                    this.viewManager.clearContextualEditors();
                }
            },
            selectionCommands: [{
                tooltip: "Edit section",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(element);
                    this.viewManager.openWidgetEditor(binding);
                }
            },
            {
                tooltip: "Add to library",
                iconClass: "paperbits-simple-add",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    const view: IView = {
                        component: {
                            name: "add-block-dialog",
                            params: GridHelper.getModel(element)
                        },
                        resize: "vertically horizontally"
                    };

                    this.viewManager.openViewAsPopup(view);
                }
            }]
        };

        const attachedModel = <SectionModel>GridHelper.getModel(element);

        if (attachedModel.widgets.length === 0) {
            sectionContextualEditor.hoverCommand = {
                position: "center",
                tooltip: "Add row",
                color: "#29c4a9",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            const sectionModel = GridHelper.getModel(element);
                            const sectionBinding = GridHelper.getWidgetBinding(element);

                            sectionModel.widgets.push(newRowModel);
                            sectionBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            };
        }

        return sectionContextualEditor;
    }
}