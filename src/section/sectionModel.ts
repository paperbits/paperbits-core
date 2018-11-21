import { WidgetModel } from "@paperbits/common/widgets";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class SectionModel {
    public widgets: WidgetModel[];
    public container: string;
    public padding: string;
    public snap: string;
    public height: string;
    public styles: Object;

    constructor() {
        this.container = "container";
        this.padding = "with-padding";
        this.snap = "none";
        this.styles = {};
        this.widgets = [];
    }
}