import { SliderViewModel } from "./sliderViewModel";
import { SlideViewModel } from "./slideViewModel";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { GridHelper } from "@paperbits/common/editing";
import { RowViewModelBinder } from "../../row/ko/rowViewModelBinder";
import { SliderModel } from "../sliderModel";
import { SectionModel } from "../../section/sectionModel";
import { RowModel } from "../../row/rowModel";

export class SliderViewModelBinder {
    constructor(
        private readonly rowViewModelBinder: RowViewModelBinder,
        private readonly viewManager: IViewManager
    ) {
    }

    public modelToViewModel(model: SliderModel, readonly: boolean, viewModel?: SliderViewModel): SliderViewModel {
        if (!viewModel) {
            viewModel = new SliderViewModel();
        }

        let classes = [];

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
                let rowViewModels = slideModel.rows.map(rowModel => {
                    return this.rowViewModelBinder.modelToViewModel(rowModel, readonly);
                })

                let slideViewModel = new SlideViewModel();

                slideViewModel.rows(rowViewModels);
                slideViewModel.layout(slideModel.layout);
                slideViewModel.background(slideModel.background);
                slideViewModel.thumbnail(slideModel.thumbnail);

                let classes = [];
                let backgroundColorKey = slideModel.background.colorKey;
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
                this.modelToViewModel(model, readonly, viewModel);
            },

            getContextualEditor: (widgetElement: HTMLElement, activeSliderHalf: string): IContextualEditor => {
                const sliderModel = <SliderModel>GridHelper.getModel(widgetElement);

                const sliderContextualEditor: IContextualEditor = {
                    element: widgetElement,
                    color: "#607d8b",
                    hoverCommand: {
                        position: activeSliderHalf,
                        tooltip: "Add section",
                        color: "#2b87da",
                        component: {
                            name: "section-layout-selector",
                            params: {
                                onSelect: (newSectionModel: SectionModel) => {
                                    let sectionElement = widgetElement;
                                    let sectionHalf = activeSliderHalf;

                                    let mainElement = GridHelper.getParentElementWithModel(sectionElement);
                                    let mainModel = GridHelper.getModel(mainElement);
                                    let mainWidgetModel = GridHelper.getWidgetBinding(mainElement);
                                    let sectionModel = <SectionModel>GridHelper.getModel(sectionElement);
                                    let index = mainModel.sections.indexOf(sectionModel);

                                    if (sectionHalf === "bottom") {
                                        index++;
                                    }

                                    mainModel.sections.splice(index, 0, newSectionModel);
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
                            let sourceMainElement = widgetElement.parentElement;
                            let sourceMainModel = GridHelper.getModel(sourceMainElement);
                            let sourceMainWidgetModel = GridHelper.getWidgetBinding(sourceMainElement);
                            let widgetModel = GridHelper.getModel(widgetElement);

                            if (sourceMainModel) {
                                sourceMainModel.sections.remove(widgetModel);
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
                            let model = <SliderModel>GridHelper.getModel(widgetElement);
                            model.previousSlide();

                            let widgetModel = GridHelper.getWidgetBinding(widgetElement);
                            widgetModel.applyChanges();
                        }
                    },
                    {
                        tooltip: "Next slide",
                        iconClass: "icon-tail-right",
                        position: "center",
                        color: "#607d8b",
                        callback: () => {
                            let model = <SliderModel>GridHelper.getModel(widgetElement);
                            model.nextSlide();

                            let widgetModel = GridHelper.getWidgetBinding(widgetElement);
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
                }

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
                                    let sliderBinding = GridHelper.getWidgetBinding(widgetElement);

                                    slideModel.rows.push(newRowModel);
                                    sliderBinding.applyChanges();

                                    this.viewManager.clearContextualEditors();
                                }
                            }
                        }
                    }
                }

                return sliderContextualEditor;
            }
        }

        return viewModel;
    }

    public canHandleModel(model: SliderModel): boolean {
        return model instanceof SliderModel;
    }
}
