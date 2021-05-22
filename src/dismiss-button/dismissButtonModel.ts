import { LocalStyles } from "@paperbits/common/styles";

/**
 * Dismiss button widget model.
 */
export class DismissButtonModel {
    /**
     * Label on the button.
     */
    public label: string;

    /**
     * Local styles.
     */
    public styles: LocalStyles;

    /**
     * Icon key.
     */
    public iconKey?: string;

    constructor() {
        this.label = "Dismiss";
        this.styles = { appearance: "components/button/default" };
    }
}
