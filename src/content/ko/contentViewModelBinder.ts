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
import { ContentPart } from "../../content-part/ko";


export class ContentViewModelBinder implements ViewModelBinder<ContentModel, ContentViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly contentModelBinder: ContentModelBinder<ContentModel>,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly eventManager: EventManager
    ) { }

    public createBinding(model: ContentModel, viewModel: ContentViewModel, bindingContext: Bag<any>): void {
        let savingTimeout;

        const updateContent = (changeDescription: string): void => {
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
                onValueUpdate(contentContract, changeDescription);
            }
        };

        const scheduleUpdate = (changeDescription: string): void => {
            clearTimeout(savingTimeout);
            savingTimeout = setTimeout(() => updateContent(changeDescription), 500);
        };

        const binding: IWidgetBinding<ContentModel, ContentViewModel> = {
            displayName: `${model.type} content`,
            layer: model.type === bindingContext.activeLayer
                ? model.type
                : bindingContext.layer,
            readonly: model.type === bindingContext.activeLayer,
            name: "content",
            model: model,
            draggable: true,
            handler: ContentHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            },
            onCreate: () => {
                if (model.type === bindingContext?.activeLayer) {
                    this.eventManager.addEventListener(Events.ContentUpdate, scheduleUpdate);
                    binding.flow = ComponentFlow.None;
                }
                else {
                    binding.flow = ComponentFlow.Block;
                }
            },
            onDispose: () => {
                if (model.type === bindingContext?.activeLayer) {
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
            childBindingContext.readonly = model.type !== bindingContext?.layer;
            childBindingContext.template = bindingContext.template;
            childBindingContext.styleManager = bindingContext.styleManager;
            childBindingContext.layer = model.type; // setting same layer for all child components
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

        if (viewModels.length === 0 && bindingContext.layer !== model.type) {
            viewModel.widgets.push(new ContentPart(`${model.type} content`));
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