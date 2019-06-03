import { GridCellModel } from "./gridCellModel";
import { GridCellContract } from "./gridCellContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class GridCellModelBinder implements IModelBinder<GridCellModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "grid-cell";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof GridCellModel;
    }

    public async contractToModel(contract: GridCellContract, bindingContext?: Bag<any>): Promise<GridCellModel> {
        const gridCellModel = new GridCellModel();

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        gridCellModel.widgets = await Promise.all<any>(modelPromises);

        return gridCellModel;
    }

    public modelToContract(model: GridCellModel): Contract {
        const contract: any = {
            type: "grid-cell",
            nodes: []
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
