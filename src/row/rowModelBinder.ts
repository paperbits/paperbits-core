import { Contract, Bag } from "@paperbits/common";
import { RowContract } from "./rowContract";
import { RowModel } from "./rowModel";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class RowModelBinder {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout-row";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof RowModel;
    }

    public async contractToModel(contract: RowContract, bindingContext?: Bag<any>): Promise<RowModel> {
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

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });

        rowModel.widgets = await Promise.all<any>(modelPromises);

        return rowModel;
    }

    public modelToContract(rowModel: RowModel): Contract {
        const rowConfig: RowContract = {
            type: "layout-row",
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
            rowConfig.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return rowConfig;
    }
}
