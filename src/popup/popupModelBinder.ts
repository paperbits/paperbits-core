import * as Utils from "@paperbits/common/utils";
import { PopupModel } from "./popupModel";
import { PopupContract } from "./popupContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class PopupModelBinder implements IModelBinder<PopupModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "popup";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PopupModel;
    }

    public async contractToModel(contract: PopupContract, bindingContext?: Bag<any>): Promise<PopupModel> {
        const model = new PopupModel();
        model.key = contract.key;
        model.styles = contract.styles;
        model.backdrop = contract.backdrop;

        if (!contract.nodes) {
            contract.nodes = contract.nodes || [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: PopupModel): Contract {
        const contract: PopupContract = {
            type: "popup",
            key: model.key,
            styles: model.styles,
            backdrop: model.backdrop,
            nodes: model.widgets.map(widget => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(widget);
                return modelBinder.modelToContract(widget);
            })
        };

        return contract;
    }
}
