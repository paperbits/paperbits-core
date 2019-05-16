import * as Utils from "@paperbits/common/utils";
import { GridCellViewModel } from "./gridCellViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { GridCellModel } from "../gridCellModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { GridCellHandlers } from "../gridCellHandlers";
import { IEventManager } from "@paperbits/common/events";

export class GridCellViewModelBinder implements IViewModelBinder<GridCellModel, GridCellViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    private toTitleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private getAlignmentClass(styles: Object, alignmentString: string, targetBreakpoint: string): void {
        if (!alignmentString) {
            return;
        }

        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        const x = styles["alignX"] || {};
        const y = styles["alignY"] || {};

        x[targetBreakpoint] = `utils/content/alignHorizontally${this.toTitleCase(horizontal)}`;
        y[targetBreakpoint] = `utils/content/alignVertically${this.toTitleCase(vertical)}`;

        styles["alignX"] = x;
        styles["alignY"] = y;
    }

    public modelToViewModel(model: GridCellModel, gridCellViewModel?: GridCellViewModel): GridCellViewModel {
        if (!gridCellViewModel) {
            gridCellViewModel = new GridCellViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel);

                return widgetViewModel;
            });

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel(model.role));
        }

        gridCellViewModel.styles(model.styles);
        gridCellViewModel.widgets(widgetViewModels);

        const binding: IWidgetBinding = {
            name: "grid-cell",
            displayName: "Area",
            flow: "inline",
            model: model,
            editor: "grid-cell-editor",
            handler: GridCellHandlers,

            /**
             * editor: LayoutGridCellEditor,
             * contextMenu: GridCellContextMenu,
             * type: "inline"
             */

            applyChanges: (changes) => {
                Object.assign(model, changes);
                this.modelToViewModel(model, gridCellViewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        gridCellViewModel["widgetBinding"] = binding;

        return gridCellViewModel;
    }

    public canHandleModel(model: GridCellModel): boolean {
        return model instanceof GridCellModel;
    }
}