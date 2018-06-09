import { Contract } from "@paperbits/common";

export interface TableOfContentsContract extends Contract {
    title?: string;
    navigationItemKey?: string;
}