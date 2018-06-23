import { Contract } from "@paperbits/common/contract";

export interface ICodeNode extends Contract {
    language: string;
    code: string;
    theme: string;
    isEditable: boolean;
}