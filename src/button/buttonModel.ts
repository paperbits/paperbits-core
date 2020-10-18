import { HyperlinkModel } from "@paperbits/common/permalinks";
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
     * Button local styles.
     */
    public styles: LocalStyles;

    /**
     * Keys of user roles.
     */
    public roles?: string[];

    /**
     * Icon key.
     */
    public iconKey?: string;

    constructor() {
        this.label = "Button";
        this.styles = { appearance: "components/button/default" };
    }
}
