import { IModelBinder } from "@paperbits/common/editing";
import { DismissButtonModel } from "./dismissButtonModel";
import { Contract } from "@paperbits/common";
import { DismissButtonContract } from "./dismissButtonContract";


export class DismissButtonModelBinder implements IModelBinder<DismissButtonModel>  {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "dismiss-button";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof DismissButtonModel;
    }

    public async contractToModel(contract: DismissButtonContract): Promise<DismissButtonModel> {
        const model = new DismissButtonModel();
        model.label = contract.label;
        model.styles = contract.styles || { appearance: "components/button/default" };
        model.iconKey = contract.iconKey;

        return model;
    }

    public modelToContract(model: DismissButtonModel): Contract {
        const dismissButtonConfig: DismissButtonContract = {
            type: "dismiss-button",
            label: model.label,
            styles: model.styles,
            iconKey: model.iconKey
        };

        return dismissButtonConfig;
    }
}
