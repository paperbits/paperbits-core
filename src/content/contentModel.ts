import { WidgetModel } from "@paperbits/common/widgets/widgetModel";

/**
 * Model of Content widget.
 */
export class ContentModel {
    /**
     * Type of the content, e.g. `page` or `layout`.
     */
    public type: string;

    /**
     * Descendant widgets.
     */
    public widgets: WidgetModel[];

    constructor() {
        this.widgets = [];
    }
}
