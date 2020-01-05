import * as Objects from "@paperbits/common/objects";
import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModel } from "../layoutModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutHandlers } from "../layoutHandlers";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { ModelBinderSelector, ViewModelBinder } from "@paperbits/common/widgets";
import { ILayoutService } from "@paperbits/common/layouts";
import { Bag } from "@paperbits/common";


export class LayoutViewModelBinder implements ViewModelBinder<LayoutModel, LayoutViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly layoutService: ILayoutService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly layoutModelBinder: LayoutModelBinder
    ) { }

    public createBinding(model: LayoutModel, viewModel: LayoutViewModel, bindingContext?: Bag<any>): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const contentContract = {
                type: "layout",
                nodes: []
            };

            model.widgets.forEach(section => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
                contentContract.nodes.push(modelBinder.modelToContract(section));
            });

            await this.layoutService.updateLayoutContent(model.key, contentContract);
        };

        const scheduleUpdate = async (): Promise<void> => {
            if (bindingContext["routeKind"] !== "layout") {
                return;
            }

            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(updateContent, 600);
        };

        const binding: IWidgetBinding<LayoutModel> = {
            name: "layout",
            displayName: "Layout",
            model: model,
            readonly: bindingContext && bindingContext["routeKind"] !== "layout",
            handler: LayoutHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            },
            onCreate: () => {
                this.eventManager.addEventListener("onContentUpdate", scheduleUpdate);
            },
            onDispose: () => this.eventManager.removeEventListener("onContentUpdate", scheduleUpdate)
        };

        viewModel["widgetBinding"] = binding;
    }

    public async modelToViewModel(model: LayoutModel, viewModel?: LayoutViewModel, bindingContext?: Bag<any>): Promise<LayoutViewModel> {
        if (!viewModel) {
            viewModel = new LayoutViewModel();
        }

        let childBindingContext: Bag<any> = {};

        if (bindingContext) {
            childBindingContext = <Bag<any>>Objects.clone(bindingContext || {});
            childBindingContext.readonly = !bindingContext["routeKind"] || bindingContext["routeKind"] !== "layout";
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, childBindingContext);

            viewModels.push(widgetViewModel);
        }

        viewModel.widgets(viewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext);
        }

        return viewModel;
    }

    public canHandleModel(model: LayoutModel): boolean {
        return model instanceof LayoutModel;
    }

    
    public async getLayoutViewModelByKey(path: string, layoutKey: string): Promise<any> {
        const bindingContext = { navigationPath: path, routeKind: "layout" };
        const layoutContract = await this.layoutService.getLayoutByKey(layoutKey);
        const layoutModel = await this.layoutModelBinder.contractToModel(layoutContract, bindingContext);
        const layoutViewModel = this.modelToViewModel(layoutModel, null, bindingContext);

        return layoutViewModel;
    }

    public async getLayoutViewModel(path: string, routeKind: string): Promise<any> {
        const bindingContext = { navigationPath: path, routeKind: routeKind };
        const layoutContract = await this.layoutService.getLayoutByPermalink(path);
        const layoutModel = await this.layoutModelBinder.contractToModel(layoutContract, bindingContext);
        const layoutViewModel = this.modelToViewModel(layoutModel, null, bindingContext);

        return layoutViewModel;
    }
}