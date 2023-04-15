import { SectionContract } from "./sectionContract";
import { SectionModel } from "./sectionModel";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
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
        private readonly containerModelBinder: ContainerModelBinder,
        private readonly securityModelBinder: SecurityModelBinder<any, any>
    ) { }

    public async contractToModel(contract: SectionContract, bindingContext?: Bag<any>): Promise<SectionModel> {
        const model = new SectionModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.widgets = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);

        if (contract.security) {
            model.security = await this.securityModelBinder.contractToModel(contract.security);
        }

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

        const childNodes = this.containerModelBinder.getChildContracts(model.widgets);
        contract.nodes.push(...childNodes);

        return contract;
    }
}
