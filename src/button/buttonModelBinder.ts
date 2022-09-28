import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { SecurityModelBinder } from "@paperbits/common/security";
import { ButtonContract } from "./buttonContract";
import { ButtonModel } from "./buttonModel";


export class ButtonModelBinder implements IModelBinder<ButtonModel>  {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly securityModelBinder: SecurityModelBinder<any, any>
    ) { }

    public async contractToModel(contract: ButtonContract): Promise<ButtonModel> {
        const model = new ButtonModel();
        model.label = contract.label;
        model.styles = contract.styles || { appearance: "components/button/default" };
        model.iconKey = contract.iconKey;

        if (contract.roles) { // converting legacy security contract
            contract.security = {
                roles: contract.roles
            }
        }

        if (contract.security) {
            model.security = await this.securityModelBinder.contractToModel(contract.security);
        }

        if (contract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromContract(contract.hyperlink);
        }

        return model;
    }

    public modelToContract(model: ButtonModel): Contract {
        const contract: ButtonContract = {
            type: "button",
            label: model.label,
            styles: model.styles,
            iconKey: model.iconKey
        };

        if (model.security) {
            contract.security = this.securityModelBinder.modelToContract(model.security);
        }

        if (model.hyperlink) {
            contract.hyperlink = {
                target: model.hyperlink.target,
                targetKey: model.hyperlink.targetKey,
                anchor: model.hyperlink.anchor
            };
        }

        return contract;
    }
}
