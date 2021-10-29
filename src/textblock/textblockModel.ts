import { LocalStyles } from "@paperbits/common/styles";
import { BlockModel } from "@paperbits/common/text/models";

export class TextblockModel {
    /**
     * Content.
     */
    public content: BlockModel[];

    /**
     * Button local styles.
     */
    public styles: LocalStyles;

    /**
     * Keys of user roles.
     */
     public roles?: string[];

    constructor(content: BlockModel[]) {
        this.content = content;
        this.styles = {};
    }
}