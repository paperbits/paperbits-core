import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { ButtonModel } from "../buttonModel";
import { Button } from "./button";


export class ButtonViewModelBinder implements ViewModelBinder<ButtonModel, Button>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToInstance(state: WidgetState, componentInstance: Button): void {
        componentInstance.label(state.label);
        componentInstance.hyperlink(state.hyperlink);
        componentInstance.security(state.security);
        componentInstance.icon(state.iconClass);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: ButtonModel, state: WidgetState): Promise<void> {
        state.label = model.label;
        state.hyperlink = model.hyperlink;
        state.security = model.security;

        if (model.iconKey) {
            state.iconClass = this.styleCompiler.getIconClassName(model.iconKey);
        }

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}