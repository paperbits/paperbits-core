import { MediaService } from "@paperbits/common/media";
import { getThumbnailUrl } from "@paperbits/common/media/mediaUtils";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { MediaVariantModel } from "../mediaVariantModel";
import { PictureModel } from "../pictureModel";
import { Picture } from "./picture";


export class PictureViewModelBinder implements ViewModelBinder<PictureModel, Picture> {
    constructor(
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly mediaService: MediaService
    ) { }

    public stateToInstance(state: WidgetState, componentInstance: Picture): void {
        componentInstance.sourceUrl(state.sourceUrl);
        componentInstance.hyperlink(state.hyperlink);
        componentInstance.caption(state.caption);
        componentInstance.width(state.width);
        componentInstance.height(state.height);
        componentInstance.styles(state.styles);
        componentInstance.variants(state.variants);
    }

    public async modelToState(model: PictureModel, state: WidgetState): Promise<void> {
        let sourceUrl = null;

        if (model.sourceKey) {
            const media = await this.mediaService.getMediaByKey(model.sourceKey);

            if (media?.variants?.length > 0) {
                const variants = media.variants.map(variantContract => {
                    const variantModel = new MediaVariantModel();
                    variantModel.width = variantContract.width;
                    variantModel.height = variantContract.height;
                    variantModel.mimeType = variantContract.mimeType;
                    variantModel.downloadUrl = variantContract.downloadUrl;
                    return variantModel;
                });

                state.variants = variants;

                sourceUrl = getThumbnailUrl(media);
            }
            else {
                sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);
            }

            if (!sourceUrl) {
                console.warn(`Unable to set picture. Media with source key ${model.sourceKey} not found.`);
            }
        }

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }

        state.sourceUrl = sourceUrl;
        state.caption = model.caption;
        state.hyperlink = model.hyperlink;
        state.width = model.width;
        state.height = model.height;
    }
}