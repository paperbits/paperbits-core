import { RowModel } from "../row/rowModel";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class SectionModel {
    public rows: RowModel[];
    public container: string;
    public padding: string;
    public snap: string;
    public height: string;
    public background: BackgroundModel;

    constructor() {
        this.container = "container";
        this.padding = "with-padding";
        this.snap = "none";
        this.background = new BackgroundModel();
        this.rows = [];
    }
}