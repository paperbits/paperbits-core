import { WidgetModel } from "@paperbits/common/widgets/WidgetModel";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class SectionModel {
    public widgets: WidgetModel[];
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
        this.widgets = [];
    }
}