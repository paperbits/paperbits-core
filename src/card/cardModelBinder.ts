import * as Utils from "@paperbits/common/utils";
import { CardModel } from "./cardModel";
import { CardContract } from "./cardContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class CardModelBinder implements IModelBinder {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "card";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CardModel;
    }

    public async contractToModel(contract: CardContract): Promise<CardModel> {
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

        const modelPromises = contract.nodes.map(async (node) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return modelBinder.contractToModel(node);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: CardModel): Contract {
        const contract: CardContract = {
            type: "card",
            object: "block",
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
