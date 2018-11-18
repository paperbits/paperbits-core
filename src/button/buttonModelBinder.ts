import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ButtonModel } from "./buttonModel";
import { Contract } from "@paperbits/common";

export class ButtonModelBinder implements IModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "button";
    }

    public canHandleModel(model): boolean {
        return model instanceof ButtonModel;
    }

    public async contractToModel(buttonContract: Contract): Promise<ButtonModel> {
        const model = new ButtonModel();
        model.label = buttonContract.label;
        model.styles = buttonContract.styles || { appearance: "components/button/default" };

        if (buttonContract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromConfig(buttonContract.hyperlink);
        }

        return model;
    }

    public modelToContract(buttonModel: ButtonModel): Contract {
        const buttonConfig: Contract = {
            object: "block",
            type: "button",
            label: buttonModel.label,
            styles: buttonModel.styles
        };

        if (buttonModel.hyperlink) {
            buttonConfig.hyperlink = {
                target: buttonModel.hyperlink.target,
                permalinkKey: buttonModel.hyperlink.permalinkKey,
                href: buttonModel.hyperlink.href
            };
        }

        return buttonConfig;
    }
}
