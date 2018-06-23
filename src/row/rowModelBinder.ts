import { Contract } from "@paperbits/common";
import { RowContract } from "./rowContract";
import { RowModel } from "./rowModel";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class RowModelBinder {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-row";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof RowModel;
    }

    public async nodeToModel(contract: RowContract): Promise<RowModel> {
        const rowModel = new RowModel();

        if (contract.align) {
            if (contract.align.sm) {
                rowModel.alignSm = contract.align.sm;
            }
            if (contract.align.md) {
                rowModel.alignMd = contract.align.md;
            }
            if (contract.align.lg) {
                rowModel.alignLg = contract.align.lg;
            }
        }

        if (contract.justify) {
            if (contract.justify.sm) {
                rowModel.justifySm = contract.justify.sm;
            }
            if (contract.justify.md) {
                rowModel.justifyMd = contract.justify.md;
            }
            if (contract.justify.lg) {
                rowModel.justifyLg = contract.justify.lg;
            }
        }

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (node) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return await modelBinder.nodeToModel(node);
        });

        rowModel.widgets = await Promise.all<any>(modelPromises);

        return rowModel;
    }

    public getConfig(rowModel: RowModel): Contract {
        const rowConfig: RowContract = {
            type: "layout-row",
            object: "block",
            nodes: []
        };

        rowConfig.align = {};
        rowConfig.align.sm = rowModel.alignSm;
        rowConfig.align.md = rowModel.alignMd;
        rowConfig.align.lg = rowModel.alignLg;

        rowConfig.justify = {};
        rowConfig.justify.sm = rowModel.justifySm;
        rowConfig.justify.md = rowModel.justifyMd;
        rowConfig.justify.lg = rowModel.justifyLg;

        rowModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            rowConfig.nodes.push(modelBinder.getConfig(widgetModel));
        });

        return rowConfig;
    }
}
