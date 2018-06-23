import { WidgetModel } from "@paperbits/common/widgets/WidgetModel";

export class ColumnModel implements WidgetModel {    
    public widgets: WidgetModel[];
    public sizeXs: number;
    public sizeSm: number;
    public sizeMd: number;
    public sizeLg: number;
    public sizeXl: number;
    public alignmentXs: string;
    public alignmentSm: string;
    public alignmentMd: string;
    public alignmentLg: string;
    public alignmentXl: string;
    public orderXs: number;
    public orderSm: number;
    public orderMd: number;
    public orderLg: number;
    public orderXl: number;

    constructor() {
        this.widgets = [];
    }
}