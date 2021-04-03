import { TableContract } from "../table/tableContract";
import { TableModel } from "./tableModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { TableCellModel } from "../table-cell";

export class TableModelBinder implements IModelBinder<TableModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "table";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableModel;
    }

    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: TableContract, bindingContext?: Bag<any>): Promise<TableModel> {
        contract.nodes = contract.nodes || [];

        const model = new TableModel();
        model.styles = contract.styles;
        model.numOfCols = contract.numOfCols;
        model.numOfRows = contract.numOfRows;

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<TableCellModel>(modelPromises);

        return model;
    }

    public modelToContract(model: TableModel): any {
        const contract: TableContract = {
             numOfCols: model.numOfCols,
             numOfRows: model.numOfRows,
            type: "table",
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
