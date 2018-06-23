import template from "./rowLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "@paperbits/knockout/decorators";
import { ColumnModel } from "../../column/columnModel";
import { RowModel } from "../rowModel";

export interface ColumnSize {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    display?: number;
}

@Component({
    selector: "row-layout-selector",
    template: template,
    injectable: "rowLayoutSelector"
})
export class RowLayoutSelector implements IResourceSelector<RowModel> {
    public readonly onResourceSelected: (rowModel: RowModel) => void;
    public readonly rowConfigs: ColumnSize[][] = [
        [{ xs: 12 }],
        [{ xs: 12, md: 6 }, { xs: 12, md: 6 }],
        [{ xs: 12, md: 4 }, { xs: 12, md: 4 }, { xs: 12, md: 4 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 8 }, { xs: 12, md: 4 }], [{ xs: 12, md: 4 }, { xs: 12, md: 8 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 9 }], [{ xs: 12, md: 9 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 6 }, { xs: 12, md: 3 }, { xs: 12, md: 3 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 3 }, { xs: 12, md: 6 }],
        [{ xs: 12, md: 3 }, { xs: 12, md: 6 }, { xs: 12, md: 3 }]
    ];

    constructor(
        private readonly viewManager: IViewManager,
        private readonly onSelect: (rowModel: RowModel) => void
    ) {
        this.selectRowLayout = this.selectRowLayout.bind(this);
        this.onResourceSelected = onSelect;
    }

    public selectRowLayout(columnSizes: ColumnSize[]): void {
        let rowModel = new RowModel();

        columnSizes.forEach(size => {
            let column = new ColumnModel();
            column.sizeXs = size.xs;
            column.sizeSm = size.sm;
            column.sizeMd = size.md;
            column.sizeLg = size.lg;
            column.sizeXl = size.xl;
            rowModel.widgets.push(column);
        });

        if (this.onResourceSelected) {
            this.onResourceSelected(rowModel);
        }
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}