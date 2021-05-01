import * as Utils from "@paperbits/common/utils";
import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { SectionModel } from "./sectionModel";
import { RowModel } from "../row/rowModel";
import { EventManager } from "@paperbits/common/events";
import { SectionModelBinder } from "./sectionModelBinder";


export class SectionHandlers {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
        private readonly sectionModelBinder: SectionModelBinder
    ) { }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const sectionContextualEditor: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: [{
                position: context.half,
                iconClass: "paperbits-icon paperbits-simple-add",
                tooltip: "Add section",
                color: "#2b87da",
                component: {
                    name: "grid-layout-selector",
                    params: {
                        heading: "Add section",
                        onSelect: (sectionModel: SectionModel) => {
                            if (!sectionModel.styles.instance) {
                                sectionModel.styles.instance = {};
                            }

                            sectionModel.styles.instance.key = Utils.randomClassName();

                            const sectionHalf = context.half;

                            let index = context.parentModel.widgets.indexOf(context.model);

                            if (sectionHalf === "bottom") {
                                index++;
                            }

                            context.parentModel.widgets.splice(index, 0, sectionModel);
                            context.parentBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                            this.eventManager.dispatchEvent("onContentUpdate");
                        }
                    }
                }
            }],
            deleteCommand: {
                tooltip: "Delete section",
                color: "#2b87da",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            selectCommands: [{
                tooltip: "Edit section",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: "#2b87da",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Add to library",
                iconClass: "paperbits-icon paperbits-simple-add",
                position: "top right",
                color: "#2b87da",
                callback: () => {
                    const sectionContract = this.sectionModelBinder.modelToContract(<SectionModel>context.model);

                    const view: View = {
                        heading: "Add to library",
                        component: {
                            name: "add-block-dialog",
                            params: {
                                blockContract: sectionContract,
                                blockType: "layout-section"
                            }
                        },
                        resize: "vertically horizontally"
                    };

                    this.viewManager.openViewAsPopup(view);
                }
            }]
        };

        if (context.model.widgets.length === 0) {
            sectionContextualEditor.hoverCommands.push({
                position: "center",
                iconClass: "paperbits-icon paperbits-simple-add",
                tooltip: "Add row",
                color: "#29c4a9",
                component: {
                    name: "grid-layout-selector",
                    params: {
                        heading: "Add row",
                        onSelect: (newRowModel: RowModel) => {
                            const sectionModel = context.model;
                            const sectionBinding = context.binding;

                            sectionModel.widgets.push(newRowModel);
                            sectionBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                            this.eventManager.dispatchEvent("onContentUpdate");
                        }
                    }
                }
            });
        }

        return sectionContextualEditor;
    }
}