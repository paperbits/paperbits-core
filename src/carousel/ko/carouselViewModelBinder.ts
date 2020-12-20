import { CarouselViewModel } from "./carousel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { CarouselItemModel, CarouselModel } from "../carouselModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { CarouselHandlers } from "../carouselHandlers";
import { EventManager } from "@paperbits/common/events";
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

        const binding: IWidgetBinding<CarouselItemModel> = {
            name: "carousel-item",
            displayName: `Slide ${index + 1}`,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "flex",
            editor: "carousel-item-editor",
            handler: CarouselItemHandlers,
            applyChanges: async (changes) => {
                await this.itemModelToViewModel(model, index, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public async modelToViewModel(model: CarouselModel, viewModel?: CarouselViewModel, bindingContext?: Bag<any>): Promise<CarouselViewModel> {
        if (!viewModel) {
            viewModel = new CarouselViewModel();
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
        viewModel.activeItemIndex(null);
        viewModel.activeItemIndex(0);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<CarouselModel> = {
            name: "carousel",
            displayName: "Carousel",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "block",
            editor: "carousel-editor",
            handler: CarouselHandlers,
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: CarouselModel): boolean {
        return model instanceof CarouselModel;
    }
}