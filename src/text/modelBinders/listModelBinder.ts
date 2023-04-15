import { Contract, Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";
import { ListModel } from "@paperbits/common/text/models/listModel";
import { ListContract } from "../contracts/listContract";
import { ContainerModelBinder } from "@paperbits/common/editing";

export class ListModelBinder {
    private listTypes = ["ordered-list", "bulleted-list"];

    constructor(
        private readonly containerModelBinder: ContainerModelBinder,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return this.listTypes.includes(contract.type);
    }

    public canHandleModel(model: ListModel): boolean {
        return this.listTypes.includes(model.type);
    }

    public async contractToModel(contract: ListContract, bindingContext?: Bag<any>): Promise<ListModel> {
        const model = new ListModel(contract.type);

        const localStyles = contract.styles || contract.attrs?.styles;
        let className: string;

        if (localStyles) {
            className = await this.styleCompiler.getClassNamesForLocalStylesAsync(localStyles);
        }

        model.attrs = {
            styles: localStyles,
            className: className
        };

        if (contract.nodes && contract.nodes.length > 0) {
            model.nodes = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);
        }

        return model;
    }

    public modelToContract(model: ListModel): ListContract {
        const contract: ListContract = {
            nodes: [],
            type: model.type,
            styles: model.attrs?.styles
        };

        if (model.nodes && model.nodes.length > 0) {
            contract.nodes = [];

            const childNodes: any[] = this.containerModelBinder.getChildContracts(<any>model.nodes);
            contract.nodes.push(...childNodes);
        }

        return contract;
    }
}