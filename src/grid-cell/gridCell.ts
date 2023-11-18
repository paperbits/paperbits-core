import { Bag, Contract } from "@paperbits/common";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { GridCellContract } from "./gridCellContract";
import { GridCellModel } from "./gridCellModel";

export class GridCellModelBinder extends CollectionModelBinder implements IModelBinder<GridCellModel> {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected modelBinderSelector: ModelBinderSelector
    ) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "grid-cell";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof GridCellModel;
    }

    public async contractToModel(contract: GridCellContract, bindingContext?: Bag<any>): Promise<GridCellModel> {
        const gridCellModel = new GridCellModel();
        gridCellModel.widgets = await this.getChildModels(contract.nodes, bindingContext);
        return gridCellModel;
    }

    public modelToContract(model: GridCellModel): Contract {
        const contract: Contract = {
            type: "grid-cell",
            nodes: this.getChildContracts(model.widgets),
        };

        return contract;
    }
}
