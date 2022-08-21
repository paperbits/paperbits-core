import { HyperlinkModel } from "@paperbits/common/permalinks";
import { SecurityModel } from "@paperbits/common/security";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Button widget model.
 */
export class ButtonModel {
    /**
     * Label on the button.
     */
    public label: string;

    /**
     * Assigned hyperlink.
     */
    public hyperlink: HyperlinkModel;

    /**
     * Icon key.
     */
     public iconKey?: string;

    /**
     * Button local styles.
     */
    public styles: LocalStyles;

    /**
     * Security settings.
     */
    public security?: SecurityModel;

    constructor() {
        this.label = "Button";
        this.styles = { appearance: "components/button/default" };
    }
}
