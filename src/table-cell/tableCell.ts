import { Bag, Contract } from "@paperbits/common";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { TableCellContract } from "./tableCellContract";
import { TableCellModel } from "./tableCellModel";

export class TableCellModelBinder extends CollectionModelBinder implements IModelBinder<TableCellModel> {
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
        tableCellModel.widgets = await this.getChildModels(contract.nodes, bindingContext);
        return tableCellModel;
    }

    public modelToContract(model: TableCellModel): Contract {
        const contract: any = {
            type: "table-cell",
            nodes: this.getChildContracts(model.widgets)
        };

        return contract;
    }
}
