//import { Code } from "../widgets/codeblock/code";
import { CodeModel } from "./codeModel";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class CodeblockModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "codeblock";
    }

    public canHandleModel(model): boolean {
        return model instanceof CodeModel;
    }

    public async contractToModel(node: Contract): Promise<CodeModel> {
        let codeModel = new CodeModel();
        return codeModel;
    }

    public modelToContract(codeModel: CodeModel): Contract {
        let codeConfig: Contract = {
            object: "block",
            type: "codeblock",
            language: codeModel.lang,
            code: codeModel.code,
            theme: codeModel.theme,
            isEditable: codeModel.isEditable
        }

        return codeConfig;
    }
}