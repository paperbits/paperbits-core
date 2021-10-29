import { SectionViewModel } from "./sectionViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { SectionModel } from "../sectionModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { SectionHandlers } from "../sectionHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { WidgetViewModel } from "../../ko";


export class SectionViewModelBinder implements ViewModelBinder<SectionModel, SectionViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: SectionModel, viewModel?: SectionViewModel, bindingContext?: Bag<any>): Promise<SectionViewModel> {
        if (!viewModel) {
            viewModel = new SectionViewModel();
        }

        const promises = model.widgets.map(widgetModel => {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            return widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
        });

        const viewModels = await Promise.all<WidgetViewModel>(promises);

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Section"));
        }

        viewModel.widgets(viewModels);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<SectionModel, SectionViewModel> = {
            name: "section",
            displayName: "Section",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "flex",
            editor: "layout-section-editor",
            handler: SectionHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: SectionModel): boolean {
        return model instanceof SectionModel;
    }
}