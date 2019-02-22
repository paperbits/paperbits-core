import { PageViewModel } from "./pageViewModel";
import { IViewModelBinder, ModelBinderSelector } from "@paperbits/common/widgets";
import { PageModel } from "../pageModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PageHandlers } from "../pageHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IPageService } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { IEventManager } from "@paperbits/common/events";

export class PageViewModelBinder implements IViewModelBinder<PageModel, PageViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly pageService: IPageService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public createBinding(model: PageModel, viewModel: PageViewModel): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const url = this.routeHandler.getPath();
            const page = await this.pageService.getPageByPermalink(url);

            const contentContract = {
                nodes: []
            };

            model.widgets.forEach(section => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
                contentContract.nodes.push(modelBinder.modelToContract(section));
            });

            await this.pageService.updatePageContent(page.key, contentContract);
        };

        const scheduleUpdate = async (): Promise<void> => {
            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(updateContent, 600);
        };

        const binding: IWidgetBinding = {
            displayName: "Content",
            name: "page",
            model: model,
            handler: PageHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => this.modelToViewModel(model, viewModel),
            onCreate: () => {
                const metadata = this.routeHandler.getCurrentUrlMetadata();

                if (metadata && metadata["usePagePlaceholder"]) {
                    return;
                }

                this.eventManager.addEventListener("onContentUpdate", scheduleUpdate);
            },
            onDispose: () => {
                this.eventManager.removeEventListener("onContentUpdate", scheduleUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;
    }

    public modelToViewModel(model: PageModel, viewModel?: PageViewModel): PageViewModel {
        if (!viewModel) {
            viewModel = new PageViewModel();
        }

        const childViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                return widgetViewModelBinder.modelToViewModel(widgetModel);
            })
            .filter(x => x !== null);

        // if (childViewModels.length === 0) {
        //     childViewModels.push(new PlaceholderViewModel("Content"));
        // }

        viewModel.widgets(childViewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel);
        }

        return viewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}