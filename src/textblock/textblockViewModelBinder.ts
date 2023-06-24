import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { TextblockModel } from "./textblockModel";


export class TextblockViewModelBinder implements ViewModelBinder<TextblockModel, TextblockViewModel> {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public async stateToInstance(state: WidgetState, componentInstance: TextblockViewModel): Promise<void> {
        componentInstance.content(state.content);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: TextblockModel, state: WidgetState): Promise<void> {
        state.content = model.content;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}