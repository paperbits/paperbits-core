import { Contract } from "@paperbits/common";

export interface SectionContract extends Contract {
    styles?: any;

    /**
     *  Layout types: container, full width.
     */
    layout?: string;

    padding?: string;
}