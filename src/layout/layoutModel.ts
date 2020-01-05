import { WidgetModel } from "@paperbits/common/widgets";

/**
 * Layout widget model.
 */
export class LayoutModel implements WidgetModel {
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
