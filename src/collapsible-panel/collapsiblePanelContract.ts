import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";


export interface CollapsiblePanelContract extends Contract {
    styles?: LocalStyles;
    nodes?: any[];
    version: string; 
}