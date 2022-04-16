import { CarouselViewModel } from "./carousel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { CarouselItemModel, CarouselModel } from "../carouselModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { CarouselHandlers } from "../carouselHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { CarouselItemViewModel } from "./carouselItemViewModel";
import { CarouselItemHandlers } from "../carouselItemHandlers";


export class CarouselViewModelBinder implements ViewModelBinder<CarouselModel, CarouselViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async itemModelToViewModel(model: CarouselItemModel, index: number, viewModel?: CarouselItemViewModel, bindingContext?: Bag<any>): Promise<CarouselItemViewModel> {
        if (!viewModel) {
            viewModel = new CarouselItemViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel(`Slide ${index + 1}`));
        }

        viewModel.widgets(viewModels);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<CarouselItemModel, CarouselViewModel> = {
            name: "carousel-item",
            displayName: `Slide ${index + 1}`,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            flow: "flex",
            editor: "carousel-item-editor",
            handler: CarouselItemHandlers,
            applyChanges: async () => {
                await this.itemModelToViewModel(model, index, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    private createBinding(model: CarouselModel, viewModel?: CarouselViewModel, bindingContext?: Bag<any>): void {
        const binding: IWidgetBinding<CarouselModel, CarouselViewModel> = {
            name: "carousel",
            displayName: "Carousel",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: ComponentFlow.Block,
            editor: "carousel-editor",
            handler: CarouselHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        binding["setActiveItem"] = (index: number) => viewModel.activeItemIndex(index);
        viewModel["widgetBinding"] = binding;
        viewModel.activeItemIndex(0);
    }

    public async modelToViewModel(model: CarouselModel, viewModel?: CarouselViewModel, bindingContext?: Bag<any>): Promise<CarouselViewModel> {
        if (!viewModel) {
            viewModel = new CarouselViewModel();
            this.createBinding(model, viewModel, bindingContext);
        }

        const carouselItemViewModels = [];

        for (const [index, carouselItemModel] of model.carouselItems.entries()) {
            const carouselItemViewModel = await this.itemModelToViewModel(carouselItemModel, index, null, bindingContext);
            carouselItemViewModels.push(carouselItemViewModel);
        }

        if (carouselItemViewModels.length === 0) {
            carouselItemViewModels.push(<any>new PlaceholderViewModel("Carousel"));
        }

        viewModel.carouselItems(carouselItemViewModels);
        viewModel.autoplay(model.autoplay);
        viewModel.pauseOnHover(model.pauseOnHover);
        viewModel.autoplayInterval(model.autoplayInterval);
        viewModel.showControls(model.showControls);
        viewModel.showIndicators(model.showIndicators);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        return viewModel;
    }

    public canHandleModel(model: CarouselModel): boolean {
        return model instanceof CarouselModel;
    }
}