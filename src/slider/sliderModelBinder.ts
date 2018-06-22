import { SliderModel, SlideModel } from "./sliderModel";
import { RowModel } from "../row/rowModel";
import { RowModelBinder } from "../row/rowModelBinder";
import { IModelBinder } from "@paperbits/common/editing";
import { BackgroundModelBinder, BackgroundModel } from "@paperbits/common/widgets/background";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { Contract } from "@paperbits/common";

export class SliderModelBinder implements IModelBinder {
    private readonly rowModelBinder: RowModelBinder;
    private readonly backgroundModelBinder: BackgroundModelBinder;
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(rowModelBinder: RowModelBinder, backgroundModelBinder: BackgroundModelBinder, permalinkResolver: IPermalinkResolver) {
        this.rowModelBinder = rowModelBinder;
        this.backgroundModelBinder = backgroundModelBinder;
        this.permalinkResolver = permalinkResolver;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "slider";
    }

    public canHandleModel(model): boolean {
        return model instanceof SliderModel;
    }

    public async nodeToModel(sliderContract: Contract): Promise<SliderModel> {
        let sliderModel = new SliderModel();

        if (sliderContract.nodes) {
            let modelPromises = sliderContract.nodes.map(async slideContract => {
                let slideModel = new SlideModel();

                if (slideContract.nodes) {
                    let rowModelPromises = slideContract.nodes.map(this.rowModelBinder.nodeToModel);
                    slideModel.rows = await Promise.all<RowModel>(rowModelPromises);
                }

                if (slideContract.background) {
                    slideModel.background = await this.backgroundModelBinder.nodeToModel(slideContract.background);
                }

                slideModel.layout = slideContract.layout || "container";
                slideModel.padding = slideContract.padding || "with-padding";

                if (slideContract.thumbnail) {
                    slideModel.thumbnail = new BackgroundModel();
                    slideModel.thumbnail.sourceKey = slideContract.thumbnail.sourceKey;
                    slideModel.thumbnail.sourceUrl = await this.permalinkResolver.getUrlByPermalinkKey(slideContract.thumbnail.sourceKey);
                }

                return slideModel;
            });

            let slideModels = await Promise.all<any>(modelPromises);
            sliderModel.slides = slideModels;
            sliderModel.size = sliderContract.size;
            sliderModel.style = sliderContract.style || "style1";
        }

        return sliderModel;
    }

    public getConfig(sliderModel: SliderModel): Contract {
        let sliderContract: Contract = {
            type: "slider",
            object: "block",
            size: sliderModel.size,
            style: sliderModel.style,
            nodes: sliderModel.slides.map(slideModel => {
                let slideContract: Contract = {
                    type: "slide",
                    object: "block",
                    nodes: [],
                    layout: slideModel.layout,
                    padding: slideModel.padding
                };

                if (slideModel.thumbnail && slideModel.thumbnail.sourceKey) {
                    slideContract.thumbnail = {
                        sourceKey: slideModel.thumbnail.sourceKey
                    }
                }

                if (slideModel.background) {
                    slideContract.background = {
                        color: slideModel.background.colorKey,
                        size: slideModel.background.size,
                        position: slideModel.background.position
                    }

                    if (slideModel.background.sourceType === "picture") {
                        slideContract.background.picture = {
                            sourcePermalinkKey: slideModel.background.sourceKey,
                            repeat: slideModel.background.repeat
                        }
                    }
                }

                slideModel.rows.forEach(row => {
                    slideContract.nodes.push(this.rowModelBinder.getConfig(row));
                });

                return slideContract;
            })
        }

        return sliderContract;
    }
}
