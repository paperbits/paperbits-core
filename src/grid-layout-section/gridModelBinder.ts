import { GridContract } from "../grid/gridContract";
import { GridModel } from "./gridModel";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";

export class GridModelBinder implements IModelBinder<GridModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "grid";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof GridModel;
    }

    constructor(private readonly containerModelBinder: ContainerModelBinder) { }

    public async contractToModel(contract: GridContract, bindingContext?: Bag<any>): Promise<GridModel> {
        const model = new GridModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles;
        model.widgets = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: GridModel): any {
        const contract: GridContract = {
            type: "grid",
            nodes: [],
            styles: model.styles
        };

        const childNodes = this.containerModelBinder.getChildContracts(model.widgets);
        contract.nodes.push(...childNodes);

        return contract;
    }
}
