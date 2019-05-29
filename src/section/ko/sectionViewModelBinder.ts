import { SectionViewModel } from "./sectionViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { SectionModel } from "../sectionModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { SectionHandlers } from "../sectionHandlers";
import { IEventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";


export class SectionViewModelBinder implements ViewModelBinder<SectionModel, SectionViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: SectionModel, viewModel?: SectionViewModel, bindingContext?: Bag<any>): Promise<SectionViewModel> {
        if (!viewModel) {
            viewModel = new SectionViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Section"));
        }

        viewModel.widgets(viewModels);
        viewModel.container(model.container);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getClassNamesByStyleConfigAsync2(model.styles));
        }

        const binding: IWidgetBinding = {
            name: "section",
            displayName: "Section",
            model: model,
            flow: "block",
            editor: "layout-section-editor",
            handler: SectionHandlers,
            applyChanges: (changes) => {
                Object.assign(model, changes);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: SectionModel): boolean {
        return model instanceof SectionModel;
    }
}