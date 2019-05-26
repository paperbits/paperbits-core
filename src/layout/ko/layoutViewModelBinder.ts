import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModel } from "../layoutModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutHandlers } from "../layoutHandlers";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { ModelBinderSelector, ViewModelBinder } from "@paperbits/common/widgets";
import { ILayoutService } from "@paperbits/common/layouts";
import { Bag } from "@paperbits/common";


export class LayoutViewModelBinder implements ViewModelBinder<LayoutModel, LayoutViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager,
        private readonly layoutService: ILayoutService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly layoutModelBinder: LayoutModelBinder
    ) {
        this.getLayoutViewModel = this.getLayoutViewModel.bind(this);
    }

    public createBinding(model: LayoutModel, viewModel: LayoutViewModel, bindingContext?: Bag<any>): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const layout = await this.layoutService.getLayoutByRoute(bindingContext.navigationPath);
            const layoutContent = await this.layoutService.getLayoutContent(layout.key);

            const contentContract = {
                nodes: []
            };

            model.widgets.forEach(section => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
                contentContract.nodes.push(modelBinder.modelToContract(section));
            });

            Object.assign(layoutContent, contentContract);

            await this.layoutService.updateLayoutContent(layout.key, layoutContent);
        };

        const scheduleUpdate = async (): Promise<void> => {
            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(updateContent, 600);
        };

        const binding: IWidgetBinding = {
            name: "layout",
            model: model,
            handler: LayoutHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            },
            onCreate: () => {
                if (!bindingContext || !bindingContext["routeKind"] || bindingContext["routeKind"] !== "layout") {
                    return;
                }

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

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        viewModel.permalinkTemplate(model.permalinkTemplate);
        viewModel.widgets(viewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext);
        }

        return viewModel;
    }

    public canHandleModel(model: LayoutModel): boolean {
        return model instanceof LayoutModel;
    }

    public async getLayoutViewModel(path: string, routeKind: string): Promise<any> {
        const bindingContext = { navigationPath: path, routeKind: routeKind };
        const layoutContract = await this.layoutService.getLayoutByRoute(path);
        const layoutModel = await this.layoutModelBinder.contractToModel(layoutContract, bindingContext);
        const layoutViewModel = this.modelToViewModel(layoutModel, null, bindingContext);

        return layoutViewModel;
    }
}
