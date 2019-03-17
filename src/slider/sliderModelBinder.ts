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

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "slider";
    }

    public canHandleModel(model): boolean {
        return model instanceof SliderModel;
    }

    public async contractToModel(sliderContract: Contract): Promise<SliderModel> {
        const sliderModel = new SliderModel();

        if (sliderContract.nodes) {
            const modelPromises = sliderContract.nodes.map(async slideContract => {
                const slideModel = new SlideModel();

                if (slideContract.nodes) {
                    const rowModelPromises = slideContract.nodes.map(this.rowModelBinder.contractToModel);
                    slideModel.rows = await Promise.all<RowModel>(rowModelPromises);
                }

                if (slideContract.background) {
                    slideModel.background = await this.backgroundModelBinder.contractToModel(slideContract.background);
                }

                slideModel.layout = slideContract.layout || "container";
                slideModel.padding = slideContract.padding || "with-padding";

                if (slideContract.thumbnail) {
                    slideModel.thumbnail = new BackgroundModel();
                    slideModel.thumbnail.sourceKey = slideContract.thumbnail.sourceKey;
                    slideModel.thumbnail.sourceUrl = await this.permalinkResolver.getUrlByTargetKey(slideContract.thumbnail.sourceKey);
                }

                return slideModel;
            });

            const slideModels = await Promise.all<any>(modelPromises);
            sliderModel.slides = slideModels;
            sliderModel.size = sliderContract.size;
            sliderModel.style = sliderContract.style || "style1";
        }

        return sliderModel;
    }

    public modelToContract(sliderModel: SliderModel): Contract {
        const sliderContract: Contract = {
            type: "slider",
            size: sliderModel.size,
            style: sliderModel.style,
            nodes: sliderModel.slides.map(slideModel => {
                const slideContract: Contract = {
                    type: "slide",
                    nodes: [],
                    layout: slideModel.layout,
                    padding: slideModel.padding
                };

                if (slideModel.thumbnail && slideModel.thumbnail.sourceKey) {
                    slideContract.thumbnail = {
                        sourceKey: slideModel.thumbnail.sourceKey
                    };
                }

                if (slideModel.background) {
                    slideContract.background = {
                        color: slideModel.background.colorKey,
                        size: slideModel.background.size,
                        position: slideModel.background.position
                    };

                    if (slideModel.background.sourceType === "picture") {
                        slideContract.background.picture = {
                            sourcePermalinkKey: slideModel.background.sourceKey,
                            repeat: slideModel.background.repeat
                        };
                    }
                }

                slideModel.rows.forEach(row => {
                    slideContract.nodes.push(this.rowModelBinder.modelToContract(row));
                });

                return slideContract;
            })
        };

        return sliderContract;
    }
}
