import { PopupHostModel } from "./popupHostModel";
import { PopupHostContract } from "./popupHostContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class PopupHostModelBinder implements IModelBinder<PopupHostModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "popup-host";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PopupHostModel;
    }

    public async contractToModel(contract: PopupHostContract, bindingContext?: Bag<any>): Promise<PopupHostModel> {
        const model = new PopupHostModel();

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: PopupHostModel): Contract {
        const contract: PopupHostContract = {
            type: "popup-host",
            nodes: []
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
