import * as Utils from "@paperbits/common/utils";
import { Contract, Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { BlockModel } from "@paperbits/common/text/models/blockModel";
import { BlockContract } from "../contracts/blockContract";

export class BlockModelBinder {
    private blockTypes: string[] = ["paragraph", "list-item", "break", "formatted", "quote", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6", "property"];

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly styleCompiler: StyleCompiler
    ) {
    }

    private isHeading(type: string): boolean {
        return /^heading\d$/gm.test(type);
    }

    public canHandleContract(contract: Contract): boolean {
        return this.blockTypes.includes(contract.type);
    }

    public canHandleModel(model: Object): boolean {
        return this.blockTypes.includes(model["type"]); // TODO: Replace with instanceOf
    }

    public async contractToModel(contract: BlockContract, bindingContext?: Bag<any>): Promise<BlockModel> {
        const model = new BlockModel(contract.type);

        let identifier = contract.identifier || contract.attrs?.id || contract.attrs?.key;
        const localStyles = contract.styles || contract.attrs?.styles;
        let className: string;

        if (localStyles) {
            className = await this.styleCompiler.getClassNamesForLocalStylesAsync(localStyles);
        }

        if (!identifier && this.isHeading(contract.type)) {
            identifier = Utils.identifier();
        }

        model.attrs = {
            id: identifier,
            styles: localStyles,
            className: className,
            name: contract.name,
            placeholder: contract.placeholder
        };

        if (contract.nodes && contract.nodes.length > 0) {
            const modelPromises = contract.nodes.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
                return await modelBinder.contractToModel(contract, bindingContext);
            });

            model.nodes = await Promise.all<any>(modelPromises);
        }

        return model;
    }

    public modelToContract(model: BlockModel): BlockContract {
        const contract: BlockContract = {
            type: model.type,
            styles: model.attrs?.styles,
            identifier: model.attrs?.id,
            name: model.attrs?.["name"], // TODO: Quick fix, needs to be refactored.
            placeholder: model.attrs?.["placeholder"], // TODO: Quick fix, needs to be refactored.
        };

        if (!contract.identifier && this.isHeading(contract.type)) {
            contract.identifier = Utils.identifier();
        }

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