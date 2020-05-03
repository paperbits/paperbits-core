import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { CalendlyButtonModel } from "./calendlyCalendlyButtonModel";
import { Contract } from "@paperbits/common";
import { CalendlyButtonContract } from "./calendlyCalendlyButtonContract";
import { BuiltInRoles } from "@paperbits/common/user";


export class CalendlyButtonModelBinder implements IModelBinder<CalendlyButtonModel>  {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "calendlyCalendlyButton";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CalendlyButtonModel;
    }

    public async contractToModel(contract: CalendlyButtonContract): Promise<CalendlyButtonModel> {
        const model = new CalendlyButtonModel();
        model.label = contract.label;
        model.roles = contract.roles || [BuiltInRoles.everyone.key];
        model.styles = contract.styles || { appearance: "components/calendlyCalendlyButton/default" };

        if (contract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromContract(contract.hyperlink);
        }

        return model;
    }

    public modelToContract(model: CalendlyButtonModel): Contract {
        const roles = model.roles
            && model.roles.length === 1
            && model.roles[0] === BuiltInRoles.everyone.key
            ? null
            : model.roles;

        const calendlyCalendlyButtonConfig: CalendlyButtonContract = {
            type: "calendlyCalendlyButton",
            label: model.label,
            styles: model.styles,
            roles: roles
        };

        if (model.hyperlink) {
            calendlyCalendlyButtonConfig.hyperlink = {
                target: model.hyperlink.target,
                targetKey: model.hyperlink.targetKey
            };
        }

        return calendlyCalendlyButtonConfig;
    }
}
