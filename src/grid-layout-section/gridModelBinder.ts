import { GridContract } from "../grid/gridContract";
import { GridModel } from "./gridModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";

export class GridModelBinder implements IModelBinder<GridModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "grid";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof GridModel;
    }

    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: GridContract, bindingContext?: Bag<any>): Promise<GridModel> {
        const model = new GridModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles;

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: GridModel): any {
        const contract: GridContract = {
            type: "grid",
            nodes: [],
            styles: model.styles
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
