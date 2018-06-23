import { PlaceholderViewModelBinder } from "../placeholder/ko/placeholderViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";

export class ViewModelBinderSelector {
    private readonly viewModelBinders: Array<IViewModelBinder<any, any>>;

    constructor(modelBinders: Array<IViewModelBinder<any, any>>) {
        this.viewModelBinders = modelBinders;
    }

    public getViewModelBinderByModel<TModel>(model: TModel): IViewModelBinder<any, any> {
        const viewModelBinder = this.viewModelBinders.find(x => x.canHandleModel(model));

        if (!viewModelBinder) {
            console.warn(`Could not find view model binder for model: ${model.constructor["name"] || model}`);
            return new PlaceholderViewModelBinder();
        }

        return viewModelBinder;
    }
}