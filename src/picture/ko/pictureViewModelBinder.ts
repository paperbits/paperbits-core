import { PictureViewModel } from "./pictureViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { PictureModel } from "../pictureModel";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { Bag } from "@paperbits/common";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { IWidgetBinding } from "@paperbits/common/editing";

export class PictureViewModelBinder implements ViewModelBinder<PictureModel, PictureViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
    ) { }

    public async modelToViewModel(model: PictureModel, viewModel?: PictureViewModel, bindingContext?: Bag<any>): Promise<PictureViewModel> {
        if (!viewModel) {
            viewModel = new PictureViewModel();
        }

        let sourceUrl = null;

        if (model.sourceKey) {
            sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);

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

        const binding: IWidgetBinding<PictureModel> = {
            name: "picture",
            displayName: "Picture",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            editor: "picture-editor",
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: PictureModel): boolean {
        return model instanceof PictureModel;
    }
}