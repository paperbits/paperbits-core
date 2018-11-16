import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModel } from "../layoutModel";
import { LayoutModelBinder } from "../layoutModelBinder";
import { LayoutHandlers } from "../layoutHandlers";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { IRouteHandler } from "@paperbits/common/routing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { ILayoutService } from "@paperbits/common/layouts";


export class LayoutViewModelBinder {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager,
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly layoutModelBinder: LayoutModelBinder
    ) { 
        this.getLayoutViewModel = this.getLayoutViewModel.bind(this);
    }

    public createBinding(model: LayoutModel, viewModel: LayoutViewModel): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const url = this.routeHandler.getCurrentUrl();
            const layout = await this.layoutService.getLayoutByRoute(url);
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
                const metadata = this.routeHandler.getCurrentUrlMetadata();

                if (!metadata || !metadata["usePagePlaceholder"]) {
                    return;
                }

                this.eventManager.addEventListener("onContentUpdate", scheduleUpdate);
            },
            onDispose: () => this.eventManager.removeEventListener("onContentUpdate", scheduleUpdate)
        };

        viewModel["widgetBinding"] = binding;
    }

    public modelToViewModel(model: LayoutModel, viewModel?: LayoutViewModel): LayoutViewModel {
        if (!viewModel) {
            viewModel = new LayoutViewModel();
        }

        const sectionViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                return widgetViewModelBinder.modelToViewModel(widgetModel);
            })
            .filter(x => x !== null);

        viewModel.uriTemplate(model.uriTemplate);
        viewModel.widgets(sectionViewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel);
        }

        return viewModel;
    }

    public canHandleModel(model: LayoutModel): boolean {
        return model instanceof LayoutModel;
    }

    public async getLayoutViewModel(): Promise<any> {
        const url = this.routeHandler.getCurrentUrl();
        const layoutNode = await this.layoutService.getLayoutByRoute(url);
        const layoutModel = await this.layoutModelBinder.contractToModel(layoutNode);
        const layoutViewModel = this.modelToViewModel(layoutModel);

        return layoutViewModel;
    }
}
