import template from "./rowLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event } from "@paperbits/common/ko/decorators";
import { ColumnModel } from "../../column/columnModel";
import { RowModel } from "../rowModel";

export interface columnSizeCfg {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    display?: number;
}

@Component({
    selector: "row-layout-selector",
    template: template
})
export class RowLayoutSelector implements IResourceSelector<RowModel> {
    public readonly rowConfigs: columnSizeCfg[][] = [
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

    @Event()
    public onSelect: (rowModel: RowModel) => void;

    constructor() {
        this.selectRowLayout = this.selectRowLayout.bind(this);
    }

    public selectRowLayout(columnSizeCfgs: columnSizeCfg[]): void {
        const rowModel = new RowModel();

        columnSizeCfgs.forEach(size => {
            const column = new ColumnModel();
            column.size.xs = size.xs;
            column.size.sm = size.sm;
            column.size.md = size.md;
            column.size.lg = size.lg;
            column.size.xl = size.xl;
            rowModel.widgets.push(column);
        });

        if (this.onSelect) {
            this.onSelect(rowModel);
        }
    }
}