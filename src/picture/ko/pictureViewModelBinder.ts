import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { PictureViewModel } from "./picture";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { PictureModel } from "../pictureModel";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { Bag } from "@paperbits/common";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { MediaService } from "@paperbits/common/media";
import { MediaVariantModel } from "../mediaVariantModel";
import { PictureHandlers } from "../pictureHandlers";


export class PictureViewModelBinder implements ViewModelBinder<PictureModel, PictureViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly mediaService: MediaService
    ) { }

    public async modelToViewModel(model: PictureModel, viewModel?: PictureViewModel, bindingContext?: Bag<any>): Promise<PictureViewModel> {
        if (!viewModel) {
            viewModel = new PictureViewModel();
        }

        let sourceUrl = null;

        if (model.sourceKey) {
            const media = await this.mediaService.getMediaByKey(model.sourceKey);

            if (media?.variants) {
                const variants = media.variants.map(variantContract => {
                    const variantModel = new MediaVariantModel();
                    variantModel.width = variantContract.width;
                    variantModel.height = variantContract.height;
                    variantModel.mimeType = variantContract.mimeType;
                    variantModel.downloadUrl = variantContract.downloadUrl;
                    return variantModel;
                });

                viewModel.variants(variants);
                
                sourceUrl = MediaUtils.getThumbnailUrl(media);
            }
            else {
                sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);
            }

            if (!sourceUrl) {
                console.warn(`Unable to set picture. Media with source key ${model.sourceKey} not found.`);
            }
        }

        viewModel.sourceUrl(sourceUrl);
        viewModel.caption(model.caption);
        viewModel.hyperlink(model.hyperlink);
        viewModel.width(model.width);
        viewModel.height(model.height);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<PictureModel, PictureViewModel> = {
            name: "picture",
            displayName: "Picture",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            handler: PictureHandlers,
            draggable: true,
            flow: ComponentFlow.Inline,
            editor: "picture-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}