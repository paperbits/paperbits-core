import { Contract } from "@paperbits/common";
import { IStyleCompiler } from "@paperbits/common/styles";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { ListModel } from "../models/listModel";
import { ListContract } from "../contracts/listContract";

export class ListModelBinder {
    private listTypes = ["ordered-list", "bulleted-list"];

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return this.listTypes.includes(contract.type);
    }

    public canHandleModel(model: ListModel): boolean {
        return this.listTypes.includes(model.type);
    }

    public async contractToModel(contract: ListContract): Promise<ListModel> {
        const model = new ListModel(contract.type);

        if (contract.attrs) {
            model.attrs = {};

            if (contract.attrs.styles) {
                model.attrs.styles = contract.attrs.styles;

                const className = await this.styleCompiler.getClassNamesByStyleConfigAsync(<any>contract.attrs.styles);

                if (className) {
                    model.attrs.className = className;
                }
            }

            if (contract.attrs.order) {
                model.attrs.order = contract.attrs.order;
            }
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

    public modelToContract(model: ListModel): Contract {
        const contract: ListContract = {
            content: [],
            type: model.type
        };

        if (model.attrs) {
            contract.attrs = {};

            if (model.attrs.styles) {
                contract.attrs.styles = model.attrs.styles;
            }

            if (model.attrs.order) {
                model.attrs.order = model.attrs.order;
            }
        }

        if (model.content && model.content.length > 0) {
            model.content.forEach(contentItem => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                contract.content.push(<any>modelBinder.modelToContract(contentItem));
            });
        }

        return contract;
    }
}