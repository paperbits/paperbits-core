import { Bag } from "@paperbits/common";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { Query } from "@paperbits/common/persistence";
import { IPopupService } from "@paperbits/common/popups";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PopupHostContract } from "../popupHostContract";
import { PopupHostModel } from "../popupHostModel";
import { PopupHostModelBinder } from "../popupHostModelBinder";
import { PopupModelBinder } from "../popupModelBinder";
import { PopupHost } from "./popupHost";

export class PopupHostViewModelBinder implements ViewModelBinder<PopupHostModel, PopupHost> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly popupModelBinder: PopupModelBinder,
        private readonly popupService: IPopupService,
        private readonly popupHostModelBinder: PopupHostModelBinder
    ) { }

    private async createPopup(popupKey: string): Promise<any> {
        const popupContract: any = await this.popupService.getPopupByKey(popupKey);
        const popupModel = this.popupModelBinder.contractToModel(popupContract);

        return popupModel;
    }

    public createBinding(model: PopupHostModel, viewModel?: PopupHost, bindingContext?: Bag<any>): void {
        const addPopup = async (popupKey: string): Promise<void> => {
            model.widgets.push(await this.createPopup(popupKey));
            binding.applyChanges();
        };

        const binding: IWidgetBinding<PopupHostModel, PopupHost> = {
            name: "popup-host",
            displayName: "Popup host",
            readonly: true,
            model: model,
            draggable: false,
            applyChanges: () => this.modelToViewModel(model, viewModel, bindingContext),
            onCreate: () => this.eventManager.addEventListener("onPopupCreate", addPopup),
            onDispose: () => this.eventManager.removeEventListener("onPopupCreate", addPopup)
        };

        viewModel["widgetBinding"] = binding;
    }

    public async modelToViewModel(model: PopupHostModel, viewModel?: PopupHost, bindingContext?: Bag<any>): Promise<PopupHost> {
        if (!viewModel) {
            viewModel = new PopupHost();
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

        viewModel.widgets(widgetViewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext);
        }

        return viewModel;
    }

    public canHandleModel(model: PopupHostModel): boolean {
        return model instanceof PopupHostModel;
    }

    public async contractToViewModel(bindingContext: Bag<any>): Promise<PopupHost> {
        // TODO: Scan page and fetch referenced popup keys.
        const popupContracts = await this.popupService.search(Query.from());
        const popupHostContract: PopupHostContract = { popups: popupContracts.value };
        const popupHostModel = await this.popupHostModelBinder.contractToModel(popupHostContract, bindingContext);
        const popupHostViewModel = await this.modelToViewModel(popupHostModel, null, bindingContext);

        return popupHostViewModel;
    }
}