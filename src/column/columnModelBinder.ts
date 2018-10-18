import * as Utils from "@paperbits/common/utils";
import { ColumnModel } from "./columnModel";
import { ColumnContract } from "./columnContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class ColumnModelBinder implements IModelBinder {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-column";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof ColumnModel;
    }

    public async contractToModel(contract: ColumnContract): Promise<ColumnModel> {
        console.log(contract);
        const columnModel = new ColumnModel();

        if (contract.size) {
            contract.size = Utils.optimizeBreakpoints(contract.size);
            columnModel.size = contract.size;
        }

        if (contract.alignment) {
            contract.alignment = Utils.optimizeBreakpoints(contract.alignment);
            columnModel.alignment = contract.alignment;
        }

        if (contract.order) {
            contract.order = Utils.optimizeBreakpoints(contract.order);
            columnModel.order = contract.order;
        }

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (node) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return modelBinder.contractToModel(node);
        });

        columnModel.widgets = await Promise.all<any>(modelPromises);

        return columnModel;
    }

    public modelToContract(columnModel: ColumnModel): Contract {
        const contract: ColumnContract = {
            type: "layout-column",
            object: "block",
            nodes: []
        };

        contract.size = columnModel.size;
        contract.alignment = columnModel.alignment;
        contract.order = columnModel.order;

        columnModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
