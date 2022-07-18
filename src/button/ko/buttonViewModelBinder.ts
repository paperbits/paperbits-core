import { Button } from "./button";
import * as Utils from "@paperbits/common/utils";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToIntance(state: any, componentInstance: Button): void {
        componentInstance.label(state.label);
        componentInstance.hyperlink(state.hyperlink);
        componentInstance.roles(state.roles);

        let iconClass: string = null;

        if (state.iconKey) {
            const segments = state.iconKey.split("/");
            const name = segments[1];
            iconClass = `icon icon-${Utils.camelCaseToKebabCase(name.replace("/", "-"))}`;
        }

        componentInstance.icon(iconClass);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: ButtonModel, state: any, bindingContext?: Bag<any>): Promise<void> {
        state.label = model.label;
        state.hyperlink = model.hyperlink;
        state.roles = model.roles;

        let iconClass: string = null;

        if (model.iconKey) {
            const segments = model.iconKey.split("/");
            const name = segments[1];
            iconClass = `icon icon-${Utils.camelCaseToKebabCase(name.replace("/", "-"))}`;
        }

        state.icon = iconClass;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
        }
    }
}