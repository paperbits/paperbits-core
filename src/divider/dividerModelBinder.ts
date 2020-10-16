import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { DividerModel } from "./dividerModel";
import { DividerContract } from "./dividerContract";


export class DividerModelBinder implements IModelBinder<DividerModel>  {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "divider";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof DividerModel;
    }

    public async contractToModel(contract: DividerContract): Promise<DividerModel> {
        const model = new DividerModel();
        model.styles = contract.styles || { appearance: "components/divider/default" };

        return model;
    }

    public modelToContract(model: DividerModel): Contract {
        const dividerConfig: DividerContract = {
            type: "divider",
            styles: model.styles
        };

        return dividerConfig;
    }
}
