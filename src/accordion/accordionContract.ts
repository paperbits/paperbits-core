import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Accordion contract.
 */
export interface AccordionContract extends Contract {
    /**
     * Local styles.
     */
    styles?: LocalStyles;

    /**
     * Accordion items.
     */
    accordionItems: AccordionItemContract[];
}

/**
 * Accordion item contract.
 */
export interface AccordionItemContract extends Contract {
    /**
     * Label on the accordion.
     */
    label: string;

    /**
     * Local styles.
     */
    styles?: LocalStyles;
}
