import { GridCellModel } from "./gridCellModel";
import { GridCellContract } from "./gridCellContract";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { ContentModelBinder } from "../content";


const nodeType = "grid-cell";

export class GridCellModelBinder extends ContentModelBinder<GridCellModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
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

        if (contract.styles) {
            gridCellModel.styles = contract.styles;
        }

        gridCellModel.role = contract.role;

        if (!contract.nodes) {
            contract.nodes = [];
        }

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
