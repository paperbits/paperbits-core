import { PlaceholderViewModelBinder } from "../placeholder/ko/placeholderViewModelBinder";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";

export class ViewModelBinderSelector {
    constructor(private viewModelBinders: ViewModelBinder<any, any>[]) { }

    public getViewModelBinderByModel<TModel>(model: TModel): ViewModelBinder<any, any> {
        if (!model) {
            throw new Error(`Parameter "model" not specified.`);
        }

        if (model instanceof PlaceholderModel) {
            return <any>(new PlaceholderViewModelBinder());
        }

        const viewModelBinder = this.viewModelBinders.find(x => x && x.canHandleModel ? x.canHandleModel(model) : false);

        if (!viewModelBinder) {
            console.warn(`Could not find view model binder for model: ${model.constructor["name"] || model}`);
            return <any>(new PlaceholderViewModelBinder());
        }

        return viewModelBinder;
    }
}