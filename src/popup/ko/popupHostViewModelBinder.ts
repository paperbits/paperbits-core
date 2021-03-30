import { PopupHost } from "./popupHost";
import { ModelBinderSelector, ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { PopupHostModel } from "../popupHostModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";
import { PopupModelBinder } from "../popupModelBinder";
import { IPopupService } from "@paperbits/common/popups";
import { Query } from "@paperbits/common/persistence";
import { PopupHostModelBinder } from "../popupHostModelBinder";

export class PopupHostViewModelBinder implements ViewModelBinder<PopupHostModel, PopupHost> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly popupModelBinder: PopupModelBinder,
        private readonly popupService: IPopupService,
        private readonly popupHostModelBinder: PopupHostModelBinder
    ) { }

    private async createPopup(popupKey: string): Promise<any> {
        const popupContent: any = await this.popupService.getPopupContent(popupKey);
        const popupModel = this.popupModelBinder.contractToModel(popupContent);

        return popupModel;
    }

    public createBinding(model: PopupHostModel, viewModel?: PopupHost, bindingContext?: Bag<any>): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const contentContract = {
                // type: model.type,
                nodes: []
            };

            model.widgets.forEach(section => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
                contentContract.nodes.push(modelBinder.modelToContract(section));
            });

            const popupNodes = contentContract.nodes;

            for (const popupNode of popupNodes) {
                await this.popupService.updatePopupContent(popupNode["key"].replace("files/", "popups/"), popupNode);
            }
        };

        const scheduleUpdate = (): void => {
            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(updateContent, 500);
        };

        const addPopup = async (popupKey: string): Promise<void> => {
            model.widgets.push(await this.createPopup(popupKey));
            binding.applyChanges();
        };

        const removePopup = () => {
            // model.widgets.splice(this.createPopup());
            // binding.applyChanges();
        };

        const binding: IWidgetBinding<PopupHostModel, PopupHost> = {
            name: "popup-host",
            displayName: "Popup host",
            readonly: true, // bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            },
            onCreate: () => {
                this.eventManager.addEventListener("onContentUpdate", scheduleUpdate);
                this.eventManager.addEventListener("onPopupCreate", addPopup);
            },
            onDispose: () => {
                this.eventManager.removeEventListener("onContentUpdate", scheduleUpdate);
                this.eventManager.removeEventListener("onPopupCreate", addPopup);
            }
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

    public async contractToViewModel(bindingContext: any): Promise<PopupHost> {
        // TODO: Scan page and fetch referenced popup keys.
        const popupContracts = await this.popupService.search(Query.from());
        const promises = popupContracts.value.map(x => this.popupService.getPopupContent(x.key));
        const popupContentContracts = await Promise.all(promises);
        const popupHostContract = { type: "popup-host", nodes: popupContentContracts };
        const popupHostModel = await this.popupHostModelBinder.contractToModel(popupHostContract, bindingContext);
        const popupHostViewModel = await this.modelToViewModel(popupHostModel, null, bindingContext);

        return popupHostViewModel;
    }
}