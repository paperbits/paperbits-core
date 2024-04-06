import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { SearchViewModel } from "./search";
import { SearchInputModel } from "../searchInputModel";
import { StyleCompiler } from "@paperbits/common/styles";


export class SearchViewModelBinder implements ViewModelBinder<SearchInputModel, SearchViewModel> {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToInstance(state: WidgetState, componentInstance: SearchViewModel): void {
        componentInstance.styles(state.styles);

        componentInstance.runtimeConfig(JSON.stringify({
            label: state.label,
            placeholder: state.placeholder
        }));
    }

    public async modelToState(model: SearchInputModel, state: WidgetState): Promise<void> {
        state.label = model.label;
        state.placeholder = model.placeholder;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}