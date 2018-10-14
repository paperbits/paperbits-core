import { PageViewModel } from "./pageViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PageModel } from "../pageModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { PageHandlers } from "../pageHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";

export class PageViewModelBinder implements IViewModelBinder<PageModel, PageViewModel> {
    constructor(private readonly viewModelBinderSelector: ViewModelBinderSelector) { }

    public modelToViewModel(model: PageModel, pageViewModel?: PageViewModel): any {
        if (!pageViewModel) {
            pageViewModel = new PageViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                const widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel);

                return widgetViewModel;
            })
            .filter(x => x !== null);

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Content"));
        }

        pageViewModel.widgets(widgetViewModels);

        const binding: IWidgetBinding = {
            displayName: "Content",
            name: "page",
            model: model,
            handler: PageHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => this.modelToViewModel(model, pageViewModel)
        };

        pageViewModel["widgetBinding"] = binding;

        return pageViewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}