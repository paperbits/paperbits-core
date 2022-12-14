import { Bag } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { PictureContract } from "./pictureContract";
import { PictureModel } from "./pictureModel";

export class PictureModelBinder implements IModelBinder<PictureModel> {
    constructor(private readonly permalinkResolver: IPermalinkResolver) { }

    public async contractToModel(contract: PictureContract, bindingContext: Bag<any>): Promise<PictureModel> {
        const model = new PictureModel();
        model.caption = contract.caption;
        model.width = contract.width;
        model.height = contract.height;
        model.styles = contract.styles || { appearance: "components/picture/default" };
        model.sourceKey = contract.sourceKey;

        if (contract.hyperlink) {
            try {
                model.hyperlink = await this.permalinkResolver.getHyperlinkFromContract(contract.hyperlink, bindingContext?.locale);
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
            width: pictureModel.width,
            height: pictureModel.height,
            styles: pictureModel.styles,
            sourceKey: pictureModel.sourceKey
        };

        if (pictureModel.hyperlink) {
            pictureContract.hyperlink = {
                target: pictureModel.hyperlink.target,
                targetKey: pictureModel.hyperlink.targetKey,
                triggerEvent: pictureModel.hyperlink.triggerEvent
            };
        }

        return pictureContract;
    }
}