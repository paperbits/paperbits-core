import { PictureModel } from "./pictureModel";
import { PictureContract } from "./pictureContract";
import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { BackgroundModel } from "@paperbits/common/widgets/background";

export class PictureModelBinder implements IModelBinder {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "picture";
    }

    public canHandleModel(model): boolean {
        return model instanceof PictureModel;
    }

    public async contractToModel(pictureContract: PictureContract): Promise<PictureModel> {
        const pictureModel = new PictureModel();
        pictureModel.caption = pictureContract.caption;
        pictureModel.layout = pictureContract.layout;
        pictureModel.animation = pictureContract.animation ? pictureContract.animation : "none";
        pictureModel.width = pictureContract.width;
        pictureModel.height = pictureContract.height;

        if (pictureContract.sourceKey) {
            const background = new BackgroundModel();
            background.sourceKey = pictureContract.sourceKey;
            background.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(pictureContract.sourceKey);
            pictureModel.background = background;

            if (!background.sourceUrl) {
                console.warn(`Unable to set picture. Media with source key ${pictureContract.sourceKey} not found.`);
            }
        }

        if (pictureContract.targetKey) {
            try {
                pictureModel.hyperlink = await this.permalinkResolver.getHyperlinkByTargetKey(pictureContract.targetKey);
            }
            catch (error) {
                console.log(error);
            }
        }

        return pictureModel;
    }

    public modelToContract(pictureModel: PictureModel): PictureContract {
        const pictureContract: PictureContract = {
            object: "block",
            type: "picture",
            caption: pictureModel.caption,
            animation: pictureModel.animation,
            layout: pictureModel.layout,
            width: pictureModel.width,
            height: pictureModel.height
        };

        if (pictureModel.background) {
            pictureContract.sourceKey = pictureModel.background.sourceKey;
        }

        if (pictureModel.hyperlink) {
            pictureContract.targetKey = pictureModel.hyperlink.targetKey;
        }

        if (pictureModel.hyperlink) {
            pictureContract.hyperlink = {
                target: pictureModel.hyperlink.target,
                targetKey: pictureModel.hyperlink.targetKey,
                href: pictureModel.hyperlink.href
            };
        }

        return pictureContract;
    }
}