import { WidgetModel } from "@paperbits/common/widgets";

export class RowModel implements WidgetModel {
    public widgets: WidgetModel[];
    public alignSm: string;
    public alignMd: string;
    public alignLg: string;
    public justifySm: string;
    public justifyMd: string;
    public justifyLg: string;

    constructor() {
        this.widgets = [];
    }
}
