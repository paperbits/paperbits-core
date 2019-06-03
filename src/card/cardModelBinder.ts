import * as Utils from "@paperbits/common/utils";
import { CardModel } from "./cardModel";
import { CardContract } from "./cardContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class CardModelBinder implements IModelBinder<CardModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "card";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CardModel;
    }

    public async contractToModel(contract: CardContract, bindingContext?: Bag<any>): Promise<CardModel> {
        const model = new CardModel();

        if (contract.alignment) {
            contract.alignment = Utils.optimizeBreakpoints(contract.alignment);
            model.alignment = contract.alignment;
        }

        model.overflowX = contract.overflowX;
        model.overflowY = contract.overflowY;
        model.styles = contract.styles;

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

    public modelToContract(model: CardModel): Contract {
        const contract: CardContract = {
            type: "card",
            styles: model.styles,
            nodes: []
        };

        contract.alignment = model.alignment;
        contract.overflowX = model.overflowX;
        contract.overflowY = model.overflowY;

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
