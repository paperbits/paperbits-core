import { GridCellModel } from "./gridCellModel";
import { GridCellContract } from "./gridCellContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { ContentModelBinder } from "../content";


export class GridCellModelBinder extends ContentModelBinder<GridCellModel> {
    constructor(protected modelBinderSelector: ModelBinderSelector) {
        super(modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "grid-cell";
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
            type: "grid-cell",
            nodes: [],
            role: model.role,
            styles: model.styles
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
