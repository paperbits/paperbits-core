import { LocalStyles } from "@paperbits/common/styles";

/**
 * Divider widget model.
 */
export class DividerModel {
    /**
     * Divider local styles.
     */
    public styles: LocalStyles;

    constructor() {
        this.styles = { appearance: "components/divider/default" };
    }
}
