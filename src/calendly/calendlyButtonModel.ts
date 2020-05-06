import { LocalStyles } from "@paperbits/common/styles";

/**
 * CalendlyButton widget model.
 */
export class CalendlyButtonModel {
    /**
     * Label on the calendlyButton.
     */
    public label: string;

    /**
     * Assigned hyperlink.
     */
    public calendlyLink: string;

    /**
     * CalendlyButton local styles.
     */
    public styles: LocalStyles;

    /**
     * Keys of user roles.
     */
    public roles?: string[];

    constructor() {
        this.label = "Schedule";
        this.styles = { appearance: "components/button/default" };
    }
}
