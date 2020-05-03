import { HyperlinkModel } from "@paperbits/common/permalinks";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * CalendlyButton widget model.
 */
export class CalendlyButtonModel {
    /**
     * Label on the calendlyCalendlyButton.
     */
    public label: string;

    /**
     * Assigned hyperlink.
     */
    public hyperlink: HyperlinkModel;

    /**
     * CalendlyButton local styles.
     */
    public styles: LocalStyles;

    /**
     * Keys of user roles.
     */
    public roles?: string[];

    constructor() {
        this.label = "CalendlyButton";
        this.styles = { appearance: "components/calendlyCalendlyButton/default" };
    }
}
