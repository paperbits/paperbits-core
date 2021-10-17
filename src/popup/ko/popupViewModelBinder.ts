import { Bag } from "@paperbits/common";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { PopupHandlers } from "../popupHandlers";
import { PopupModel } from "../popupModel";
import { PopupViewModel } from "./popup";

export class PopupViewModelBinder implements ViewModelBinder<PopupModel, PopupViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: PopupModel, viewModel?: PopupViewModel, bindingContext?: Bag<any>): Promise<PopupViewModel> {
        if (!viewModel) {
            viewModel = new PopupViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            if (widgetViewModelBinder.createWidgetBinding) {
                const binding = await widgetViewModelBinder.createWidgetBinding<any>(widgetModel, bindingContext);
                widgetViewModels.push(binding);
            }
            else {
                const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
                widgetViewModels.push(widgetViewModel);
            }
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Popup content"));
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel.identifier(model.key.replace("files/", "popups"));
        viewModel.widgets(widgetViewModels);
        viewModel.backdrop(model.backdrop);

        if (!viewModel["widgetBinding"]) {
            const binding: IWidgetBinding<PopupModel, PopupViewModel> = {
                name: "popup",
                displayName: "Popup",
                readonly: bindingContext ? bindingContext.readonly : false,
                flow: ComponentFlow.Block,
                model: model,
                draggable: true,
                editor: "popup-editor",
                provides: ["popup"],
                handler: PopupHandlers,
                applyChanges: async () => {
                    await this.modelToViewModel(model, viewModel, bindingContext);
                    this.eventManager.dispatchEvent("onContentUpdate", model.key.replace("files/", "popups/"));
                }
            };

            viewModel["widgetBinding"] = binding;
        }

        return viewModel;
    }

    public canHandleModel(model: PopupModel): boolean {
        return model instanceof PopupModel;
    }
}