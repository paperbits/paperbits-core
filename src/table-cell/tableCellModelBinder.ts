import { Bag, Contract } from "@paperbits/common";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { TableCellContract } from "./tableCellContract";
import { TableCellModel } from "./tableCellModel";
import { LocalStyles } from "@paperbits/common/styles";


export class TableCellModelBinder extends ContainerModelBinder implements IModelBinder<TableCellModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    /**
     * Migration to designated "table-cell" style plugin.
     */
    private migrateTableStyles(styles: LocalStyles): void {
        if (!styles.instance["grid-cell"]) {
            return;
        }

        styles.instance["table-cell"] = styles.instance["grid-cell"];
        delete styles.instance["grid-cell"];

        if (styles.instance["table-cell"].xs) { // Reducing unnecessary viewport variations.
            styles.instance["table-cell"] = styles.instance["table-cell"].xs;
        }
    }

    public async contractToModel(contract: TableCellContract, bindingContext?: Bag<any>): Promise<TableCellModel> {
        const tableCellModel = new TableCellModel();

        this.migrateTableStyles(contract.styles);

        tableCellModel.styles = contract.styles;
        tableCellModel.role = contract.role;
        tableCellModel.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return tableCellModel;
    }

    public modelToContract(model: TableCellModel): Contract {
        const contract: TableCellContract = {
            type: "table-cell",
            nodes: this.getChildContracts(model.widgets),
            role: model.role,
            styles: model.styles
        };

        return contract;
    }
}
