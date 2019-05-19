import { PageViewModel } from "./pageViewModel";
import { ViewModelBinder, ModelBinderSelector } from "@paperbits/common/widgets";
import { PageModel } from "../pageModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PageHandlers } from "../pageHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IPageService } from "@paperbits/common/pages";
import { IEventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class PageViewModelBinder implements ViewModelBinder<PageModel, PageViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly pageService: IPageService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public createBinding(model: PageModel, viewModel: PageViewModel, bindingContext?: Bag<any>): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            const page = await this.pageService.getPageByPermalink(bindingContext.navigationPath);

            const contentContract = {
                type: "page",
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
                if (bindingContext && bindingContext["usePagePlaceholder"]) {
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

    public async modelToViewModel(model: PageModel, viewModel?: PageViewModel, bindingContext?: Bag<any>): Promise<PageViewModel> {
        if (!viewModel) {
            viewModel = new PageViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        // if (childViewModels.length === 0) {
        //     childViewModels.push(new PlaceholderViewModel("Content"));
        // }

        viewModel.widgets(viewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext);
        }

        return viewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}