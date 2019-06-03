import * as Objects from "@paperbits/common/objects";
import { Bag } from "@paperbits/common";
import { PageViewModel } from "./pageViewModel";
import { ViewModelBinder, ModelBinderSelector } from "@paperbits/common/widgets";
import { PageModel } from "../pageModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PageHandlers } from "../pageHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IPageService } from "@paperbits/common/pages";
import { IEventManager } from "@paperbits/common/events";
import { PlaceholderViewModel } from "../../placeholder/ko";

export class PageViewModelBinder implements ViewModelBinder<PageModel, PageViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly pageService: IPageService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public createBinding(model: PageModel, viewModel: PageViewModel, bindingContext: Bag<any>, layoutEditing: boolean): void {
        let savingTimeout;

        const updateContent = async (): Promise<void> => {
            if (!bindingContext || !bindingContext.navigationPath) {
                return;
            }

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

        const binding: IWidgetBinding<PageModel> = {
            displayName: "Content",
            readonly: false,
            name: "page",
            model: model,
            handler: PageHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => this.modelToViewModel(model, viewModel, bindingContext),
            onCreate: () => {
                if (!layoutEditing) { // Note: We check specifically for "false".
                    this.eventManager.addEventListener("onContentUpdate", scheduleUpdate);
                }
            },
            onDispose: () => {
                if (!layoutEditing) {
                    this.eventManager.removeEventListener("onContentUpdate", scheduleUpdate);
                }
            }
        };

        viewModel["widgetBinding"] = binding;
    }

    public async modelToViewModel(model: PageModel, viewModel?: PageViewModel, bindingContext?: Bag<any>): Promise<PageViewModel> {
        if (!viewModel) {
            viewModel = new PageViewModel();
        }

        let childBindingContext: Bag<any> = {};
        let layoutEditing = false;

        if (bindingContext) {
            childBindingContext = <Bag<any>>Objects.clone(bindingContext);
            layoutEditing = !!(bindingContext && bindingContext["routeKind"] && bindingContext["routeKind"] === "layout");

            childBindingContext.readonly = layoutEditing;
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, childBindingContext);

            viewModels.push(widgetViewModel);
        }

        if (viewModels.length === 0) {
            const placeholderViewModel = new PlaceholderViewModel("Content");
            viewModels.push(placeholderViewModel);
        }

        viewModel.widgets(viewModels);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext, layoutEditing);
        }

        return viewModel;
    }

    public canHandleModel(model: PageModel): boolean {
        return model instanceof PageModel;
    }
}