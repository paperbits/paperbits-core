import { TableCellModel } from "./tableCellModel";
import { TableCellContract } from "./tableCellContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class TableCellModelBinder implements IModelBinder<TableCellModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "table-cell";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableCellModel;
    }

    public async contractToModel(contract: TableCellContract, bindingContext?: Bag<any>): Promise<TableCellModel> {
        const tableCellModel = new TableCellModel();

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        tableCellModel.widgets = await Promise.all<any>(modelPromises);

        return tableCellModel;
    }

    public modelToContract(model: TableCellModel): Contract {
        const contract: any = {
            type: "table-cell",
            nodes: []
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
