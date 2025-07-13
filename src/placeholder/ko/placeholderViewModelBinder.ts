import { ViewModelBinder } from "@paperbits/common/widgets";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";
import { Placeholder } from "./placeholder";

export class PlaceholderViewModelBinder implements ViewModelBinder<PlaceholderModel, Placeholder> {
    public async modelToViewModel(model: PlaceholderModel): Promise<Placeholder> {
        return new Placeholder(model.message);
    }
    public canHandleModel(model: PlaceholderModel): boolean {
        return model instanceof PlaceholderModel;
    }
}