import { ViewModelBinder } from "@paperbits/common/widgets";
import { ContentPartModel } from "@paperbits/common/widgets/contentPart";
import { IWidgetService } from "@paperbits/common/widgets";
import { ContentPartViewModelBinder } from "../content-part/ko";


export class ViewModelBinderSelector {
    constructor(
        private viewModelBinders: ViewModelBinder<any, any>[],
        private readonly widgetService: IWidgetService
    ) { }

    public getViewModelBinderByModel<TModel>(model: TModel): ViewModelBinder<any, any> {
        if (!model) {
            throw new Error(`Parameter "model" not specified.`);
        }

        if (model instanceof ContentPartModel) {
            return <any>(new ContentPartViewModelBinder());
        }

        const viewModelBinder = this.viewModelBinders.find(x => x && x.canHandleModel ? x.canHandleModel(model) : false);

        if (!viewModelBinder) {
            console.warn(`Could not find view model binder for model: ${model.constructor["name"] || model}`);
            return <any>(new ContentPartViewModelBinder());
        }

        return viewModelBinder;
    }
}