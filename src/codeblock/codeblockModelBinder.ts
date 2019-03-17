import { CodeModel } from "./codeModel";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class CodeblockModelBinder implements IModelBinder {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "codeblock";
    }

    public canHandleModel(model): boolean {
        return model instanceof CodeModel;
    }

    public async contractToModel(node: Contract): Promise<CodeModel> {
        return new CodeModel();
    }

    public modelToContract(codeModel: CodeModel): Contract {
        const contract: Contract = {
            type: "codeblock",
            language: codeModel.lang,
            code: codeModel.code,
            theme: codeModel.theme,
            isEditable: codeModel.isEditable
        };

        return contract;
    }
}