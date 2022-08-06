import { Contract, Bag } from "@paperbits/common";
import { RowContract } from "./rowContract";
import { RowModel } from "./rowModel";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";

export class RowModelBinder extends ContainerModelBinder implements IModelBinder<RowModel> {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected modelBinderSelector: ModelBinderSelector
    ) {
        super(widgetService, modelBinderSelector);
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

        rowModel.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return rowModel;
    }

    public modelToContract(model: RowModel): Contract {
        const contract: RowContract = {
            type: "layout-row",
            nodes: this.getChildContracts(model.widgets),
        };

        contract.align = {};
        contract.align.sm = model.alignSm;
        contract.align.md = model.alignMd;
        contract.align.lg = model.alignLg;

        contract.justify = {};
        contract.justify.sm = model.justifySm;
        contract.justify.md = model.justifyMd;
        contract.justify.lg = model.justifyLg;

        return contract;
    }
}
