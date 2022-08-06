import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { DismissButtonModel } from "../dismissButtonModel";
import { DismissButton } from "./dismissButtonViewModel";

export class DismissButtonViewModelBinder implements ViewModelBinder<DismissButtonModel, DismissButton>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToIntance(state: WidgetState, componentInstance: DismissButton): void {
        componentInstance.label(state.label);
        componentInstance.icon(state.iconClass);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: DismissButtonModel, state: WidgetState): Promise<void> {
        state.label = model.label;

        if (model.iconKey) {
            state.iconClass = this.styleCompiler.getIconClassName(model.iconKey);
        }

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}