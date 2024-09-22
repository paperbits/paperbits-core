import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { SearchInputModel } from "./searchInputModel";
import { SearchContract } from "./searchContract";


export class SearchModelBinder implements IModelBinder<SearchInputModel> {
    constructor(
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "input:search";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SearchInputModel;
    }

    public async contractToModel(contract: SearchContract): Promise<SearchInputModel> {
        const model = new SearchInputModel();
        model.label = contract.label;
        model.placeholder = contract.placeholder;
        model.styles = contract.styles || { appearance: "components/formGroup/default" };

        return model;
    }

    public modelToContract(model: SearchInputModel): Contract {
        const searchConfig: SearchContract = {
            type: "input:search",
            placeholder: model.placeholder,
            label: model.label,
            styles: model.styles
        };

        return searchConfig;
    }
}
