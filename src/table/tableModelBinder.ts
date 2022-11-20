import { Bag, Contract } from "@paperbits/common";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { TableCellContract } from "../table-cell";
import { TableContract } from "../table/tableContract";
import { TableModel } from "./tableModel";

export class TableModelBinder extends ContainerModelBinder implements IModelBinder<TableModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    public async contractToModel(contract: TableContract, bindingContext?: Bag<any>): Promise<TableModel> {
        const model = new TableModel();
        model.styles = contract.styles;
        model.numOfCols = contract.numOfCols;
        model.numOfRows = contract.numOfRows;
        model.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: TableModel): TableContract {
        const contract: TableContract = {
            type: "table",
            numOfCols: model.numOfCols,
            numOfRows: model.numOfRows,
            nodes: <TableCellContract[]>this.getChildContracts(model.widgets),
            styles: model.styles
        };

        return contract;
    }
}
