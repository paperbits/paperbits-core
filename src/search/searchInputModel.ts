import { LocalStyles } from "@paperbits/common/styles";

export class SearchInputModel { 
    /**
     * Text input label.
     */
    public label: string;

    /**
     * Text input placeholder.
     */
    public placeholder: string;

    /**
     * Text input local styles.
     */
    public styles: LocalStyles;

    /**
     * Invalid feedback message.
     */
    public invalidFeedback: string;

    constructor() {
        this.label = "";
        this.placeholder = "Search";
        this.invalidFeedback = "";
        this.styles = { appearance: "components/formGroup/default" };
    }
}
