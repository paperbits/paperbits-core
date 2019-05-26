import { PictureModel } from "./pictureModel";
import { PictureContract } from "./pictureContract";
import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { Contract } from "@paperbits/common";

export class PictureModelBinder implements IModelBinder {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "picture";
    }

    public canHandleModel(model): boolean {
        return model instanceof PictureModel;
    }

    public async contractToModel(contract: PictureContract): Promise<PictureModel> {
        const model = new PictureModel();
        model.caption = contract.caption;
        model.layout = contract.layout;
        model.animation = contract.animation ? contract.animation : "none";
        model.width = contract.width;
        model.height = contract.height;
        model.styles = contract.styles || { appearance: "components/picture/default" };

        if (contract.sourceKey) {
            const background = new BackgroundModel();
            background.sourceKey = contract.sourceKey;
            background.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(contract.sourceKey);
            model.background = background;

            if (!background.sourceUrl) {
                console.warn(`Unable to set picture. Media with source key ${contract.sourceKey} not found.`);
            }
        }

        if (contract.hyperlink) {
            try {
                model.hyperlink = await this.permalinkResolver.getHyperlinkByTargetKey(contract.hyperlink.targetKey);
            }
            catch (error) {
                console.log(error);
            }
        }

        return model;
    }

    public modelToContract(pictureModel: PictureModel): PictureContract {
        const pictureContract: PictureContract = {
            type: "picture",
            caption: pictureModel.caption,
            animation: pictureModel.animation,
            layout: pictureModel.layout,
            width: pictureModel.width,
            height: pictureModel.height,
            styles: pictureModel.styles
        };

        if (pictureModel.background) {
            pictureContract.sourceKey = pictureModel.background.sourceKey;
        }

        if (pictureModel.hyperlink) {
            pictureContract.hyperlink = {
                target: pictureModel.hyperlink.target,
                targetKey: pictureModel.hyperlink.targetKey
            };
        }

        return pictureContract;
    }
}