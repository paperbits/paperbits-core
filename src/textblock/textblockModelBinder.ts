import { BlockModel } from "@paperbits/common/text/models";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";

export class TextblockModelBinder implements IModelBinder<TextblockModel> {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: Contract, bindingContext?: Bag<any>): Promise<TextblockModel> {
        let content: BlockModel[] = [];

        if (contract.nodes && contract.nodes.length > 0) {
            const modelPromises = contract.nodes.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
                return await modelBinder.contractToModel(contract, bindingContext);
            });

            content = await Promise.all<BlockModel>(modelPromises);
        }

        return new TextblockModel(content);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "text-block";
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }

    public modelToContract(model: TextblockModel): Contract {
        let state: BlockModel[];

        const isArray = Array.isArray(model.state);

        if (isArray) {
            const contentItems = model.state as Object[];

            if (contentItems && contentItems.length > 0) {
                state = contentItems.map(contentItem => {
                    const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                    return modelBinder.modelToContract(contentItem);
                });
            }
        }

        const contract: Contract = {
            type: "text-block",
            nodes: state
        };

        return contract;
    }
}