import { Bag, Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { PopupContract } from "@paperbits/common/popups";
import { PopupHostContract } from "./popupHostContract";
import { PopupHostModel } from "./popupHostModel";
import { PopupModelBinder } from "./popupModelBinder";

export class PopupHostModelBinder implements IModelBinder<PopupHostModel> {
    constructor(private readonly popupModelBinder: PopupModelBinder) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "popup-host";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PopupHostModel;
    }

    public async contractToModel(contract: PopupHostContract, bindingContext?: Bag<any>): Promise<PopupHostModel> {
        const model = new PopupHostModel();

        if (!contract.popups) {
            contract.popups = [];
        }

        const modelPromises = contract.popups.map((popupContract: PopupContract) => {
            return this.popupModelBinder.contractToModel(popupContract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(): Contract {
        throw new Error("Not implemented.");
    }
}
