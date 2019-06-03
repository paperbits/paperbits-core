import * as Utils from "@paperbits/common/utils";
import { ColumnModel } from "./columnModel";
import { ColumnContract } from "./columnContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class ColumnModelBinder implements IModelBinder<ColumnModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
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

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        columnModel.widgets = await Promise.all<any>(modelPromises);

        return columnModel;
    }

    public modelToContract(model: ColumnModel): Contract {
        const contract: ColumnContract = {
            type: "layout-column",
            nodes: []
        };

        contract.size = model.size;
        contract.alignment = model.alignment;
        contract.offset = model.offset;
        contract.order = model.order;
        contract.overflowX = model.overflowX;
        contract.overflowY = model.overflowY;

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
