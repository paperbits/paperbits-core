import * as Utils from "@paperbits/common/utils";
import { Contract } from "@paperbits/common";
import { IStyleCompiler } from "@paperbits/common/styles";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { BlockModel } from "../models/blockModel";
import { BlockContract } from "../contracts/blockContract";

export class BlockModelBinder {
    private blockTypes = ["paragraph", "list-item", "break", "formatted", "quote", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6"];

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly styleCompiler: IStyleCompiler
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return this.blockTypes.includes(contract.type);
    }

    public canHandleModel(model: Object): boolean {
        return this.blockTypes.includes(model["type"]); // TODO: Replace with instanceOf
    }

    public async contractToModel(contract: BlockContract): Promise<BlockModel> {
        const model = new BlockModel(contract.type);

        if (contract.attrs) {
            if (contract.attrs.styles) {
                model.attrs = { styles: contract.attrs.styles };
                const className = await this.styleCompiler.getClassNamesByStyleConfigAsync(<any>contract.attrs.styles);
                if (className) {
                    model.attrs.className = className;
                }
            }
            if (contract.attrs.id) {
                model.attrs = model.attrs || {};
                model.attrs.id = contract.attrs.id ;
            }
        }

        if (contract.type.startsWith("heading") && contract.type.length === 8 && (!contract.attrs || !contract.attrs.id)) {
            model.attrs = model.attrs || {};
            model.attrs.id = Utils.identifier();
        }

        if (contract.content && contract.content.length > 0) {
            const modelPromises = contract.content.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
                return await modelBinder.contractToModel(contract);
            });

            model.content = await Promise.all<any>(modelPromises);
        }

        return model;
    }

    public modelToContract(model: BlockModel): Contract {
        const contract: BlockContract = {
            type: model.type
        };

        if (model.attrs) { 
            if (model.attrs.styles) {
                contract.attrs = { styles: model.attrs.styles };
            }
            if (model.attrs.id) {
                contract.attrs = contract.attrs || {};
                contract.attrs.id = model.attrs.id;
            }
        }

        if (model.content && model.content.length > 0) {
            contract.content = [];
            
            model.content.forEach(contentItem => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                contract.content.push(<any>modelBinder.modelToContract(contentItem));
            });
        }
        return contract;
    }
}