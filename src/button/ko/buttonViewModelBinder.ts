import { Button } from "./button";
import * as Utils from "@paperbits/common/utils";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public async modelToViewModel(model: ButtonModel, viewModel?: Button, bindingContext?: Bag<any>): Promise<Button> {
        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);
        viewModel.roles(model.roles);

        let iconClass: string = null;

        if (model.iconKey) {
            const segments = model.iconKey.split("/");
            const name = segments[1];
            iconClass = `icon icon-${Utils.camelCaseToKebabCase(name.replace("/", "-"))}`;
        }

        viewModel.icon(iconClass);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        return viewModel;
    }

    // TODO:  Do we still need this?
    public canHandleModel(model: ButtonModel): boolean {
        return model instanceof ButtonModel;
    }
}