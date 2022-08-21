import { SectionContract } from "./sectionContract";
import { SectionModel } from "./sectionModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { SecurityModelBinder } from "@paperbits/common/security";


export class SectionModelBinder implements IModelBinder<SectionModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly securityModelBinder: SecurityModelBinder<any, any>
    ) { }

    public async contractToModel(contract: SectionContract, bindingContext?: Bag<any>): Promise<SectionModel> {
        const model = new SectionModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};

        if (contract.security) {
            model.security = await this.securityModelBinder.contractToModel(contract.security);
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: SectionModel): SectionContract {
        const contract: SectionContract = {
            type: "layout-section",
            styles: model.styles,
            nodes: []
        };

        if (model.security) {
            contract.security = this.securityModelBinder.modelToContract(model.security);
        }

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
