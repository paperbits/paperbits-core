import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ButtonModel } from "./buttonModel";
import { Contract } from "@paperbits/common";
import { ButtonContract } from "./buttonContract";
import { BuiltInRoles } from "@paperbits/common/user";


export class ButtonModelBinder implements IModelBinder<ButtonModel>  {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "button";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof ButtonModel;
    }

    public async contractToModel(contract: ButtonContract): Promise<ButtonModel> {
        const model = new ButtonModel();
        model.label = contract.label;
        model.roles = contract.roles || [BuiltInRoles.everyone.key];
        model.styles = contract.styles || { appearance: "components/button/default" };
        model.iconKey = contract.iconKey;

        if (contract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromContract(contract.hyperlink);
        }

        return model;
    }

    public modelToContract(model: ButtonModel): Contract {
        const roles = model.roles
            && model.roles.length === 1
            && model.roles[0] === BuiltInRoles.everyone.key
            ? null
            : model.roles;

        const buttonConfig: ButtonContract = {
            type: "button",
            label: model.label,
            styles: model.styles,
            roles: roles,
            iconKey: model.iconKey
        };

        if (model.hyperlink) {
            buttonConfig.hyperlink = {
                target: model.hyperlink.target,
                targetKey: model.hyperlink.targetKey,
                anchor: model.hyperlink.anchor
            };
        }

        return buttonConfig;
    }
}
