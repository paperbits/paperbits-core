import { Contract } from "@paperbits/common";
import { HyperlinkContract } from "@paperbits/common/editing";


/**
 * CalendlyButton data contract.
 */
export interface CalendlyButtonContract extends Contract {
    /**
     * Label on the calendlyButton.
     */
    label: string;

    /**
     * CalendlyButton local styles.
     */
    styles?: any;

    /**
     * Assigned hyperlink.
     */
    calendlyLink?: string;
}