import { WidgetModel } from "@paperbits/common/widgets/widgetModel";

/**
 * Page widget model.
 */
export class PageModel implements WidgetModel {
    /**
     * Unique identifier.
     */
    public key: string;

    /**
     * Child nodes.
     */
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}
