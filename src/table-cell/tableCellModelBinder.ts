import { TableCellModel } from "./tableCellModel";
import { TableCellContract } from "./tableCellContract";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { ContentModelBinder } from "../content";


export class TableCellModelBinder extends ContentModelBinder<TableCellModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "table-cell";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableCellModel;
    }

    public async contractToModel(contract: TableCellContract, bindingContext?: Bag<any>): Promise<TableCellModel> {
        const tableCellModel = new TableCellModel();

        if (contract.styles) {
            tableCellModel.styles = contract.styles;
        }

        tableCellModel.role = contract.role;

        if (!contract.nodes) {
            contract.nodes = [];
        }

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
