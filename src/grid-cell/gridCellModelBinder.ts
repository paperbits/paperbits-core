import { Bag, Contract } from "@paperbits/common";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { GridCellContract } from "./gridCellContract";
import { GridCellModel } from "./gridCellModel";


const nodeType = "grid-cell";

export class GridCellModelBinder extends ContainerModelBinder implements IModelBinder<GridCellModel> {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected modelBinderSelector: ModelBinderSelector
    ) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === nodeType;
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof GridCellModel;
    }

    public async contractToModel(contract: GridCellContract, bindingContext?: Bag<any>): Promise<GridCellModel> {
        const gridCellModel = new GridCellModel();

        gridCellModel.styles = contract.styles;
        gridCellModel.role = contract.role;
        gridCellModel.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return gridCellModel;
    }

    public modelToContract(model: GridCellModel): Contract {
        const contract: GridCellContract = {
            type: nodeType,
            nodes: this.getChildContracts(model.widgets),
            role: model.role,
            styles: model.styles
        };

        return contract;
    }
}
