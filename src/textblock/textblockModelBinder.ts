import { BlockModel } from "@paperbits/common/text/models";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";
import { TextBlockContract } from "./textblockContract";

export class TextblockModelBinder implements IModelBinder<TextblockModel> {
    constructor(private readonly containerModelBinder: ContainerModelBinder) { }

    public async contractToModel(contract: TextBlockContract, bindingContext?: Bag<any>): Promise<TextblockModel> {
        let content: BlockModel[] = [];

        if (contract.nodes && contract.nodes.length > 0) {
            content = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);
        }

        const model = new TextblockModel(content);

        model.styles = contract.styles;
        model.roles = contract.roles;

        return model;
    }

    public modelToContract(model: TextblockModel): Contract {
        let content: Contract[];

        const isArray = Array.isArray(model.content);

        if (isArray) {
            const contentItems = model.content as Object[];

            if (contentItems && contentItems.length > 0) {
                content = this.containerModelBinder.getChildContracts(contentItems);
            }
        }

        const contract: TextBlockContract = {
            type: "text-block",
            nodes: content,
            styles: model.styles,
            roles: model.roles
        };

        return contract;
    }
}