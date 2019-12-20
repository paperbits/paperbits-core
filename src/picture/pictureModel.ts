import { HyperlinkModel } from "@paperbits/common/permalinks";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Picture widget model.
 */
export class PictureModel {
    /**
     * Key of a permalink referencing the source of the picture.
     */
    public sourceKey: string;

    /**
     * Caption on the picture, used also as alternative text.
     */
    public caption: string;

    /**
     * Hyperlink attached to the picture.
     */
    public hyperlink: HyperlinkModel;

    /**
     * Picture width.
     */
    public width: number;

    /**
     * Picture height.
     */
    public height: number;

    /**
     * Picture styles.
     */
    public styles: LocalStyles;
}