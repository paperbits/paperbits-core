import * as Utils from "@paperbits/common/utils";
import { Bag, Contract } from "@paperbits/common";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { ColumnContract } from "./columnContract";
import { ColumnModel } from "./columnModel";

export class ColumnModelBinder extends ContainerModelBinder implements IModelBinder<ColumnModel> {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected modelBinderSelector: ModelBinderSelector
    ) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout-column";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof ColumnModel;
    }

    public async contractToModel(contract: ColumnContract, bindingContext?: Bag<any>): Promise<ColumnModel> {
        const columnModel = new ColumnModel();

        if (contract.size) {
            contract.size = Utils.optimizeBreakpoints(contract.size);
            columnModel.size = contract.size;
        }

        if (contract.alignment) {
            contract.alignment = Utils.optimizeBreakpoints(contract.alignment);
            columnModel.alignment = contract.alignment;
        }

        if (contract.offset) {
            contract.offset = Utils.optimizeBreakpoints(contract.offset);
            columnModel.offset = contract.offset;
        }

        if (contract.order) {
            contract.order = Utils.optimizeBreakpoints(contract.order);
            columnModel.order = contract.order;
        }

        columnModel.overflowX = contract.overflowX;
        columnModel.overflowY = contract.overflowY;
        columnModel.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return columnModel;
    }

    public modelToContract(model: ColumnModel): Contract {
        const contract: ColumnContract = {
            type: "layout-column",
            size: model.size,
            alignment: model.alignment,
            offset: model.offset,
            order: model.order,
            overflowX: model.overflowX,
            overflowY: model.overflowY,
            nodes: this.getChildContracts(model.widgets)
        };

        return contract;
    }
}
