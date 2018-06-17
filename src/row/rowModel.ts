import { ColumnModel } from "../column/columnModel";

export class RowModel {
    public type: string = "row";
    public columns: ColumnModel[];
    public alignSm: string;
    public alignMd: string;
    public alignLg: string;
    public justifySm: string;
    public justifyMd: string;
    public justifyLg: string;

    constructor() {
        this.columns = [];
    }
}
