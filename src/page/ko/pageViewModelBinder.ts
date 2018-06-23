import { PageViewModel } from "./pageViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { DragSession } from "@paperbits/common/ui/draggables/dragSession";
import { PageModel } from "../pageModel";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets/viewModelBinderSelector";
import { SectionModel } from "../../section/sectionModel";
import { PlaceholderViewModel } from "@paperbits/knockout/editors/placeholder";

export class PageViewModelBinder implements IViewModelBinder<PageModel, PageViewModel> {
    private readonly viewModelBinderSelector: ViewModelBinderSelector;

    constructor(viewModelBinderSelector: ViewModelBinderSelector) {
        this.viewModelBinderSelector = viewModelBinderSelector;
    }

    public modelToViewModel(model: PageModel, readonly: boolean, pageViewModel?: PageViewModel): any {
        if (!pageViewModel) {
            pageViewModel = new PageViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                let widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, !readonly);

                return widgetViewModel;
            })
            .filter(x => x != null);

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Page"));
        }

        pageViewModel.widgets(widgetViewModels);

        const binding = {
            readonly: readonly,
            model: model,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => {
                this.modelToViewModel(model, readonly, pageViewModel);
            },
            onDragOver: (dragSession: DragSession): boolean => {
                return dragSession.type === "section";
            },
            onDragDrop: (dragSession: DragSession): void => {
                switch (dragSession.type) {
                    case "section":
                        model.widgets.splice(dragSession.insertIndex, 0, <SectionModel>dragSession.sourceModel);
                        break;
                }
                binding.applyChanges();
            }
        }

        pageViewModel["widgetBinding"] = binding;

        return pageViewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}