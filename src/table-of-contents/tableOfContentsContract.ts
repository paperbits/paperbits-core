import { Contract } from "@paperbits/common";

export interface TableOfContentsContract extends Contract {
    navigationItemKey?: string;
    minHeading?: number;
    maxHeading?: number;
}