import * as Objects from "@paperbits/common/objects";
import { Bag, Contract } from "@paperbits/common";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { ModelBinderSelector, ViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { ContentHandlers } from "../contentHandlers";
import { ContentModel } from "../contentModel";
import { ContentModelBinder } from "../contentModelBinder";
import { ContentViewModel } from "./contentViewModel";
import { WidgetViewModel } from "../../ko";
import { PlaceholderViewModel } from "../../placeholder/ko";


export class ContentViewModelBinder implements ViewModelBinder<ContentModel, ContentViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly contentModelBinder: ContentModelBinder<ContentModel>,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly eventManager: EventManager
    ) { }

    public createBinding(model: ContentModel, viewModel: ContentViewModel, bindingContext: Bag<any>): void {
        let savingTimeout;

        const updateContent = (): void => {
            const contentContract = {
                type: model.type,
                nodes: []
            };

            model.widgets.forEach(section => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
                contentContract.nodes.push(modelBinder.modelToContract(section));
            });

            const onValueUpdate = bindingContext?.template?.[contentContract.type]?.onValueUpdate;

            if (onValueUpdate) {
                onValueUpdate(contentContract);
            }
        };

        const scheduleUpdate = (): void => {
            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(updateContent, 500);
        };

        const binding: IWidgetBinding<ContentModel, ContentViewModel> = {
            displayName: "Content",
            readonly: false,
            name: "content",
            model: model,
            flow: ComponentFlow.Contents,
            draggable: true,
            handler: ContentHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            },
            onCreate: () => {
                if (model.type === bindingContext?.contentType) {
                    this.eventManager.addEventListener(Events.ContentUpdate, scheduleUpdate);
                }
            },
            onDispose: () => {
                if (model.type === bindingContext?.contentType) {
                    this.eventManager.removeEventListener(Events.ContentUpdate, scheduleUpdate);
                }
            }
        };

        viewModel["widgetBinding"] = binding;
    }

    public async modelToViewModel(model: ContentModel, viewModel?: ContentViewModel, bindingContext?: Bag<any>): Promise<ContentViewModel> {
        if (!viewModel) {
            viewModel = new ContentViewModel();
        }

        let childBindingContext: Bag<any> = {};

        if (bindingContext) {
            childBindingContext = <Bag<any>>Objects.clone(bindingContext);
            childBindingContext.readonly = model.type !== bindingContext?.contentType;
            childBindingContext.template = bindingContext.template;
            childBindingContext.styleManager = bindingContext.styleManager;
        }

        const promises = model.widgets.map(widgetModel => {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            return widgetViewModelBinder.modelToViewModel(widgetModel, null, childBindingContext);
        });

        const viewModels = await Promise.all<WidgetViewModel>(promises);

        if (!viewModel["widgetBinding"]) {
            this.createBinding(model, viewModel, bindingContext);
        }

        viewModel.widgets(viewModels);

        if (viewModels.length === 0 && bindingContext.contentType !== model.type) {
            viewModel.widgets.push(new PlaceholderViewModel("Main"));
        }

        return viewModel;
    }

    public canHandleModel(model: ContentModel): boolean {
        return model instanceof ContentModel;
    }

    public async contractToViewModel(contentContract: Contract, bindingContext: Bag<any>): Promise<ContentViewModel> {
        const layoutModel = await this.contentModelBinder.contractToModel(contentContract, bindingContext);
        const layoutViewModel = await this.modelToViewModel(layoutModel, null, bindingContext);

        return layoutViewModel;
    }
}