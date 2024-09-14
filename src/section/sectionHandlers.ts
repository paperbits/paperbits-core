import * as Utils from "@paperbits/common/utils";
import { IContextCommand, IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { SectionModel } from "./sectionModel";
import { RowModel } from "../row/rowModel";
import { EventManager, Events } from "@paperbits/common/events";
import { SectionModelBinder } from "./sectionModelBinder";
import { IVisibilityContextCommandProvider } from "../security/visibilityContextCommandProvider";
import { switchToChildCommand } from "@paperbits/common/ui/commands";


export class SectionHandlers implements IWidgetHandler<SectionModel> {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly visibilityCommandProvider: IVisibilityContextCommandProvider,
    ) { }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const selectCommands: IContextCommand[] = [
            {
                controlType: "toolbox-button",
                displayName: "Edit section",
                position: "top right",
                color: "#2b87da",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                controlType: "toolbox-splitter",
            },
            {
                controlType: "toolbox-button",
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
                        resizing: "vertically horizontally"
                    };

                    this.viewManager.openViewAsPopup(view);
                }
            },
        ];

        const visibilityCommand = this.visibilityCommandProvider.create(context);

        if (visibilityCommand) {
            selectCommands.push(visibilityCommand);
        }

        const contextualCommands: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: [{
                controlType: "toolbox-button",
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

                            this.viewManager.clearContextualCommands();
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                        }
                    }
                }
            }],
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete section",
                color: "#2b87da",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();

                    this.viewManager.clearContextualCommands();
                }
            },
            selectCommands: selectCommands
        };

        if (context.model.widgets.length === 0) {
            contextualCommands.hoverCommands.push({
                controlType: "toolbox-button",
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

                            this.viewManager.clearContextualCommands();
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                        }
                    }
                }
            });
        }
        else {
            contextualCommands.selectCommands.push(switchToChildCommand(context));
        }

        return contextualCommands;
    }
}