import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";
import { SecurityModel } from "@paperbits/common/security";

export class SectionModel {
    /**
     * Child widgets.
     */
    public widgets: WidgetModel[];

    /**
     * Local styles.
     */
    public styles: LocalStyles;

    /**
     * Security settings.
     */
     public security?: SecurityModel;

    constructor() {
        this.styles = {};
        this.widgets = [];
    }
}