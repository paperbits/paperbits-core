import * as Utils from "@paperbits/common/utils";
import { Contract, Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { BlockModel } from "@paperbits/common/text/models/blockModel";
import { BlockContract } from "../contracts/blockContract";

export class BlockModelBinder {
    private blockTypes = ["paragraph", "list-item", "break", "formatted", "quote", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6"];

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly styleCompiler: StyleCompiler
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return this.blockTypes.includes(contract.type);
    }

    public canHandleModel(model: Object): boolean {
        return this.blockTypes.includes(model["type"]); // TODO: Replace with instanceOf
    }

    public async contractToModel(contract: BlockContract, bindingContext?: Bag<any>): Promise<BlockModel> {
        const model = new BlockModel(contract.type);

        if (contract.attrs) {
            if (contract.attrs.styles) {
                model.attrs = { styles: contract.attrs.styles };
                const className = await this.styleCompiler.getClassNamesForLocalStylesAsync(contract.attrs.styles);
                if (className) {
                    model.attrs.className = className;
                }
            }
            if (contract.attrs.id || contract.attrs.key) {
                model.attrs = model.attrs || {};
                model.attrs.id = contract.attrs.id || contract.attrs.key;
            }
        }

        if (/^heading\d$/gm.test(contract.type) && (!model.attrs || !model.attrs.id)) {
            model.attrs = model.attrs || {};
            model.attrs.id = Utils.identifier();
        }

        if (contract.nodes && contract.nodes.length > 0) {
            const modelPromises = contract.nodes.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
                return await modelBinder.contractToModel(contract, bindingContext);
            });

            model.nodes = await Promise.all<any>(modelPromises);
        }

        return model;
    }

    public modelToContract(model: BlockModel): Contract {
        const contract: BlockContract = {
            type: model.type
        };

        contract.attrs = model.attrs;

        if (model.nodes && model.nodes.length > 0) {
            contract.nodes = [];

            model.nodes.forEach(contentItem => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                contract.nodes.push(<any>modelBinder.modelToContract(contentItem));
            });
        }
        return contract;
    }
}