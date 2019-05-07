import { Contract } from "@paperbits/common";
import { HyperlinkContract } from "@paperbits/common/editing";


export interface ButtonContract extends Contract {
    label: string;
    styles?: any;
    hyperlink?: HyperlinkContract
}