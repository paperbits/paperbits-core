import { ColumnModel } from "./columnModel";
import { ColumnContract } from "./columnContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
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
        const columnModel = new ColumnModel();

        if (contract.size) {
            columnModel.sizeXs = Number.parseInt(contract.size.xs);
            columnModel.sizeSm = Number.parseInt(contract.size.sm);
            columnModel.sizeMd = Number.parseInt(contract.size.md);
            columnModel.sizeLg = Number.parseInt(contract.size.lg);
            columnModel.sizeXl = Number.parseInt(contract.size.xl);
        }

        if (contract.alignment) {
            columnModel.alignmentXs = contract.alignment.xs;
            columnModel.alignmentSm = contract.alignment.sm;
            columnModel.alignmentMd = contract.alignment.md
            columnModel.alignmentLg = contract.alignment.lg;
            columnModel.alignmentXl = contract.alignment.xl;
        }

        if (contract.order) {
            columnModel.orderXs = Number.parseInt(contract.order.xs);
            columnModel.orderSm = Number.parseInt(contract.order.sm);
            columnModel.orderMd = Number.parseInt(contract.order.md);
            columnModel.orderLg = Number.parseInt(contract.order.lg);
            columnModel.orderXl = Number.parseInt(contract.order.xl);
        }

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (node) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return await modelBinder.contractToModel(node);
        });

        columnModel.widgets = await Promise.all<any>(modelPromises);

        return columnModel;
    }

    public modelToContract(columnModel: ColumnModel): Contract {
        let columnConfig: ColumnContract = {
            type: "layout-column",
            object: "block",
            nodes: []
        };

        columnConfig.size = {};
        columnConfig.alignment = {}
        columnConfig.order = {}

        if (columnModel.sizeSm) {
            columnConfig.size.sm = columnModel.sizeSm.toString();
        }

        if (columnModel.sizeMd) {
            columnConfig.size.md = columnModel.sizeMd.toString();
        }

        if (columnModel.sizeLg) {
            columnConfig.size.lg = columnModel.sizeLg.toString();
        }

        if (columnModel.sizeXl) {
            columnConfig.size.xl = columnModel.sizeXl.toString();
        }

        if (columnModel.alignmentXs) {
            columnConfig.alignment.xs = columnModel.alignmentXs;
        }

        if (columnModel.alignmentSm) {
            columnConfig.alignment.sm = columnModel.alignmentSm;
        }

        if (columnModel.alignmentMd) {
            columnConfig.alignment.md = columnModel.alignmentMd;
        }

        if (columnModel.alignmentLg) {
            columnConfig.alignment.lg = columnModel.alignmentLg;
        }

        if (columnModel.alignmentXl) {
            columnConfig.alignment.xl = columnModel.alignmentXl;
        }

        if (columnModel.orderXs) {
            columnConfig.order.xs = columnModel.orderXs.toString();
        }

        if (columnModel.orderSm) {
            columnConfig.order.sm = columnModel.orderSm.toString();
        }

        if (columnModel.orderMd) {
            columnConfig.order.md = columnModel.orderMd.toString();
        }

        if (columnModel.orderLg) {
            columnConfig.order.lg = columnModel.orderLg.toString();
        }

        if (columnModel.orderXl) {
            columnConfig.order.xl = columnModel.orderXl.toString();
        }

        columnModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            columnConfig.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return columnConfig;
    }
}
