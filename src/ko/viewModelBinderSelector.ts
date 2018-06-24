import { PlaceholderViewModelBinder } from "../placeholder/ko/placeholderViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class ViewModelBinderSelector {
    constructor(private viewModelBinders: Array<IViewModelBinder<any, any>>) {}

    public getViewModelBinderByModel<TModel>(model: TModel): IViewModelBinder<any, any> {
        const viewModelBinder = this.viewModelBinders.find(x => x.canHandleModel(model));

        if (!viewModelBinder) {
            console.warn(`Could not find view model binder for model: ${model.constructor["name"] || model}`);
            return new PlaceholderViewModelBinder();
        }

        return viewModelBinder;
    }
}