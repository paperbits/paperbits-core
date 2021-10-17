import { BlockModel } from "@paperbits/common/text/models";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";
import { TextBlockContract } from "./textblockContract";

export class TextblockModelBinder implements IModelBinder<TextblockModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: TextBlockContract, bindingContext?: Bag<any>): Promise<TextblockModel> {
        let content: BlockModel[] = [];

        if (contract.nodes && contract.nodes.length > 0) {
            const modelPromises = contract.nodes.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
                return await modelBinder.contractToModel(contract, bindingContext);
            });

            content = await Promise.all<BlockModel>(modelPromises);
        }

        const model = new TextblockModel(content);

        model.styles = contract.styles;
        model.roles = contract.roles;

        return model;
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "text-block";
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }

    public modelToContract(model: TextblockModel): Contract {
        let content: BlockModel[];

        const isArray = Array.isArray(model.content);

        if (isArray) {
            const contentItems = model.content as Object[];

            if (contentItems && contentItems.length > 0) {
                content = contentItems.map(contentItem => {
                    const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                    return modelBinder.modelToContract(contentItem);
                });
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