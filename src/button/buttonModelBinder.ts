import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ButtonModel } from "./buttonModel";
import { Contract } from "@paperbits/common";
import { ButtonContract } from "./buttonContract";
import { IStyleCompiler } from "@paperbits/common/styles";

export class ButtonModelBinder implements IModelBinder {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "button";
    }

    public canHandleModel(model): boolean {
        return model instanceof ButtonModel;
    }

    public async contractToModel(contract: ButtonContract): Promise<ButtonModel> {
        const model = new ButtonModel();
        model.label = contract.label;
        model.styles = contract.styles || { appearance: "components/button/default" };

        if (contract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromConfig(contract.hyperlink);
        }

        return model;
    }

    public modelToContract(buttonModel: ButtonModel): Contract {
        const buttonConfig: ButtonContract = {
            type: "button",
            label: buttonModel.label,
            styles: buttonModel.styles
        };

        if (buttonModel.hyperlink) {
            buttonConfig.hyperlink = {
                target: buttonModel.hyperlink.target,
                targetKey: buttonModel.hyperlink.targetKey
            };
        }

        return buttonConfig;
    }
}
