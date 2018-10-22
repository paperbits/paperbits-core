import { SectionViewModel } from "./sectionViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { SectionModel } from "../sectionModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { SectionHandlers } from "../sectionHandlers";
import { IEventManager } from "@paperbits/common/events";


export class SectionViewModelBinder implements IViewModelBinder<SectionModel, SectionViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: SectionModel, viewModel?: SectionViewModel): SectionViewModel {
        if (!viewModel) {
            viewModel = new SectionViewModel();
        }

        const viewModels = model.widgets
            .map(widgetModel => {
                const viewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const viewModel = viewModelBinder.modelToViewModel(widgetModel);

                return viewModel;
            });

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Section"));
        }

        viewModel.widgets(viewModels);
        viewModel.container(model.container);
        viewModel.background(model.background);
        viewModel.snapTo(model.snap);

        // if (model.background) {
        //     let backgroundColorKey = model.background.colorKey;
        //     let intentions = this.intentionsProvider.getIntentions();

        //     // TODO: Review background usage.
        //     let backgroundIntention = intentions.container.background[backgroundColorKey];
        //     ``
        //     if (!backgroundIntention) {
        //         backgroundIntention = intentions.container.background.section_bg_default;
        //     }

        //     sectionClasses.push(backgroundIntention.params());
        // }

        // if (model.padding === "with-padding") {
        //     sectionClasses.push("with-padding");
        // }

        const binding: IWidgetBinding = {
            name: "section",
            displayName: "Section",

            model: model,
            flow: "block",
            editor: "layout-section-editor",
            handler: SectionHandlers,
            applyChanges: () => {
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