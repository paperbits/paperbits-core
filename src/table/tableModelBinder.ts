import { Bag, Contract } from "@paperbits/common";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { TableCellContract } from "../table-cell";
import { TableContract } from "../table/tableContract";
import { TableModel } from "./tableModel";
import { LocalStyles } from "@paperbits/common/styles";

export class TableModelBinder extends CollectionModelBinder implements IModelBinder<TableModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    /**
     * Migration to designated "table" style plugin.
     */
    private migrateTableStyles(styles: LocalStyles): void {
        if (!styles.instance["grid"]) {
            return;
        }

        styles.instance["table"] = styles.instance["grid"];
        delete styles.instance["grid"];

        if (styles.instance["table"].xs) { // Reducing unnecessary viewport variations.
            styles.instance["table"] = styles.instance["table"].xs;
        }
    }

    public async contractToModel(contract: TableContract, bindingContext?: Bag<any>): Promise<TableModel> {
        const model = new TableModel();

        this.migrateTableStyles(contract.styles);

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
