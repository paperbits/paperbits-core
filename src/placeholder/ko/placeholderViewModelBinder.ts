import { ViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";
import { PlaceholderViewModel } from "./placeholderViewModel";

export class PlaceholderViewModelBinder implements ViewModelBinder<PlaceholderModel, PlaceholderViewModel> {
    public async modelToViewModel(model: PlaceholderModel): Promise<PlaceholderViewModel> {
        const viewModel = new PlaceholderViewModel(model.message);

        const binding = {
            flow: "contents"
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }
    public canHandleModel(model: PlaceholderModel): boolean {
        return model instanceof PlaceholderModel;
    }
}