import { SectionViewModel } from "./sectionViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IContextualEditor, IView, IViewManager } from "@paperbits/common/ui";
import { GridHelper, IWidgetBinding } from "@paperbits/common/editing";
import { SectionModel } from "../sectionModel";
import { RowViewModelBinder } from "../../row/ko/rowViewModelBinder";
import { PlaceholderViewModel } from "@paperbits/knockout/editors/placeholder";
import { RowModel } from "../../row/rowModel";

export class SectionViewModelBinder implements IViewModelBinder<SectionModel, SectionViewModel> {
    constructor(
        private readonly rowViewModelBinder: RowViewModelBinder,
        private readonly viewManager: IViewManager
    ) {
        this.rowViewModelBinder = rowViewModelBinder;
    }

    public modelToViewModel(model: SectionModel, readonly: boolean, existingViewModel?: SectionViewModel): SectionViewModel {
        if (!existingViewModel) {
            existingViewModel = new SectionViewModel();
        }

        const rowViewModels = model.rows.map(rowModel => {
            let rowViewModel = this.rowViewModelBinder.modelToViewModel(rowModel, readonly);
            return rowViewModel;
        })

        if (rowViewModels.length === 0) {
            rowViewModels.push(<any>new PlaceholderViewModel("Section"));
        }

        existingViewModel.rows(rowViewModels);
        existingViewModel.container(model.container);
        existingViewModel.background(model.background);
        existingViewModel.snapTo(model.snap);

        // if (model.background) {
        //     let backgroundColorKey = model.background.colorKey;
        //     let intentions = this.intentionsProvider.getIntentions();

        //     // TODO: Review background usage.
        //     let backgroundIntention = intentions.container.background[backgroundColorKey];
        //     ``
        //     if (!backgroundIntention) {
        //         backgroundIntention = intentions.container.background.section_bg_default;
        //     }

        //     sectionClasses.push(backgroundIntention.params());
        // }


        // if (model.padding === "with-padding") {
        //     sectionClasses.push("with-padding");
        // }


        const binding: IWidgetBinding = {
            name: "section",
            displayName: "Section",
            readonly: readonly,
            model: model,
            flow: "liquid",
            editor: "layout-section-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, existingViewModel);
            },

            getContextualEditor: (element: HTMLElement, half: string, placeholderElement?: HTMLElement, placeholderHalf?: string): IContextualEditor => {
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

                                    let mainElement = GridHelper.getParentElementWithModel(sectionElement);
                                    let mainModel = GridHelper.getModel(mainElement);
                                    let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                                    let sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                                    let index = mainModel.sections.indexOf(sectionModel);

                                    if (sectionHalf === "bottom") {
                                        index++;
                                    }

                                    mainModel.sections.splice(index, 0, newSectionModel);
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

                            mainModel.sections.remove(sectionModel);
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
                            }

                            this.viewManager.openViewAsPopup(view);
                        }
                    }]
                }

                const attachedModel = <SectionModel>GridHelper.getModel(element);

                if (attachedModel.rows.length === 0) {
                    sectionContextualEditor.hoverCommand = {
                        position: "center",
                        tooltip: "Add row",
                        color: "#29c4a9",
                        component: {
                            name: "row-layout-selector",
                            params: {
                                onSelect: (newRowModel: RowModel) => {
                                    let sectionModel = GridHelper.getModel(element);
                                    let sectionBinding = GridHelper.getWidgetBinding(element);

                                    sectionModel.rows.push(newRowModel);
                                    sectionBinding.applyChanges();

                                    this.viewManager.clearContextualEditors();
                                }
                            }
                        }
                    }
                }

                return sectionContextualEditor;
            }
        }

        existingViewModel["widgetBinding"] = binding;

        return existingViewModel;
    }

    public canHandleModel(model: SectionModel): boolean {
        return model instanceof SectionModel;
    }
}