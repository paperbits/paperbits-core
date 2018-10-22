import { SliderViewModel } from "./sliderViewModel";
import { SlideViewModel } from "./slideViewModel";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { GridHelper } from "@paperbits/common/editing";
import { RowViewModelBinder } from "../../row/ko/rowViewModelBinder";
import { SliderModel } from "../sliderModel";
import { SectionModel } from "../../section/sectionModel";
import { RowModel } from "../../row/rowModel";
import { IEventManager } from "@paperbits/common/events";

export class SliderViewModelBinder {
    constructor(
        private readonly rowViewModelBinder: RowViewModelBinder,
        private readonly viewManager: IViewManager,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: SliderModel, viewModel?: SliderViewModel): SliderViewModel {
        if (!viewModel) {
            viewModel = new SliderViewModel();
        }

        const classes = [];

        switch (model.size) {
            case "small":
                classes.push("carousel carousel-short");
                break;

            case "medium":
                classes.push("carousel");
                break;

            case "large":
                classes.push("carousel carousel-tall");
                break;
        }

        viewModel.css(classes.join(" "));
        viewModel.style(model.style);

        if (viewModel.slides) {
            viewModel.slides(model.slides.map(slideModel => {
                const rowViewModels = slideModel.rows.map(rowModel => {
                    return this.rowViewModelBinder.modelToViewModel(rowModel);
                });

                const slideViewModel = new SlideViewModel();

                slideViewModel.rows(rowViewModels);
                slideViewModel.layout(slideModel.layout);
                slideViewModel.background(slideModel.background);
                slideViewModel.thumbnail(slideModel.thumbnail);

                const classes = [];
                const backgroundColorKey = slideModel.background.colorKey;
                // let intentionMap = this.intentionsProvider.getIntentions();
                // let backgroundIntention = intentionMap.container.background[backgroundColorKey];

                // if (!backgroundIntention) {
                //     backgroundIntention = intentionMap.container.background.section_bg_default;
                // }
                // classes.push(backgroundIntention.params());

                // if (slideModel.padding === "with-padding") {
                //     classes.push(slideModel.padding);
                // }
                // slideViewModel.layout(slideModel.layout);
                // slideViewModel.css(classes.join(" "));

                // slideViewModel["widgetBinding"] = {
                //     model: slideModel,
                //     applyChanges: () => {
                //     }
                // }

                viewModel.activeSlideNumber(model.activeSlideNumber);

                return slideViewModel;
            }));
        }

        viewModel["widgetBinding"] = {
            name: "slider",
            displayName: "Slider",
            model: model,
            editor: "paperbits-slider-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            },

            getContextualEditor: (widgetElement: HTMLElement, activeSliderHalf: string): IContextualEditor => {
                const sliderModel = <SliderModel>GridHelper.getModel(widgetElement);

                const sliderContextualEditor: IContextualEditor = {
                    color: "#607d8b",
                    hoverCommand: {
                        position: activeSliderHalf,
                        tooltip: "Add section",
                        color: "#2b87da",
                        component: {
                            name: "section-layout-selector",
                            params: {
                                onSelect: (newSectionModel: SectionModel) => {
                                    const sectionElement = widgetElement;
                                    const sectionHalf = activeSliderHalf;

                                    const mainElement = GridHelper.getParentElementWithModel(sectionElement);
                                    const mainModel = GridHelper.getModel(mainElement);
                                    const mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                                    const sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                                    let index = mainModel.widgets.indexOf(sectionModel);

                                    if (sectionHalf === "bottom") {
                                        index++;
                                    }

                                    mainModel.widgets.splice(index, 0, newSectionModel);
                                    mainWidgetModel.applyChanges();

                                    this.viewManager.clearContextualEditors();
                                }
                            }
                        }
                    },
                    deleteCommand: {
                        tooltip: "Delete slider",
                        color: "#607d8b",
                        callback: () => {
                            const sourceMainElement = widgetElement.parentElement;
                            const sourceMainModel = GridHelper.getModel(sourceMainElement);
                            const sourceMainWidgetModel = GridHelper.getWidgetBinding(sourceMainElement);
                            const widgetModel = GridHelper.getModel(widgetElement);

                            if (sourceMainModel) {
                                sourceMainModel.widgets.remove(widgetModel);
                                sourceMainWidgetModel.applyChanges();
                            }

                            this.viewManager.clearContextualEditors();
                        },
                    },
                    selectionCommands: [{
                        tooltip: "Previous slide",
                        iconClass: "icon-tail-left",
                        position: "center",
                        color: "#607d8b",
                        callback: () => {
                            const model = <SliderModel>GridHelper.getModel(widgetElement);
                            model.previousSlide();

                            const widgetModel = GridHelper.getWidgetBinding(widgetElement);
                            widgetModel.applyChanges();
                        }
                    },
                    {
                        tooltip: "Next slide",
                        iconClass: "icon-tail-right",
                        position: "center",
                        color: "#607d8b",
                        callback: () => {
                            const model = <SliderModel>GridHelper.getModel(widgetElement);
                            model.nextSlide();

                            const widgetModel = GridHelper.getWidgetBinding(widgetElement);
                            widgetModel.applyChanges();
                        }
                    },
                    {
                        tooltip: "Edit slider",
                        iconClass: "paperbits-edit-72",
                        color: "#607d8b",
                        callback: () => {
                            const binding = GridHelper.getWidgetBinding(widgetElement);
                            this.viewManager.openWidgetEditor(binding);
                        }
                    }]
                };

                const slideModel = sliderModel.slides[sliderModel.activeSlideNumber];

                if (slideModel.rows.length === 0) {
                    sliderContextualEditor.hoverCommand = {
                        position: "center",
                        tooltip: "Add row",
                        color: "#29c4a9",
                        component: {
                            name: "row-layout-selector",
                            params: {
                                onSelect: (newRowModel: RowModel) => {
                                    const sliderBinding = GridHelper.getWidgetBinding(widgetElement);

                                    slideModel.rows.push(newRowModel);
                                    sliderBinding.applyChanges();

                                    this.viewManager.clearContextualEditors();
                                }
                            }
                        }
                    };
                }

                return sliderContextualEditor;
            }
        };

        return viewModel;
    }

    public canHandleModel(model: SliderModel): boolean {
        return model instanceof SliderModel;
    }
}
