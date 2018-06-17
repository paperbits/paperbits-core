import { Contract } from "@paperbits/common";

export interface IDimensionalValues {
    sm?: string;
    md?: string;
    lg?: string;
}

export interface RowContract extends Contract {
    justify?: IDimensionalValues;
    align?: IDimensionalValues;
}