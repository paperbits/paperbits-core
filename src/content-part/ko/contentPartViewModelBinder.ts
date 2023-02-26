import { ViewModelBinder } from "@paperbits/common/widgets";
import { ContentPartModel } from "@paperbits/common/widgets/contentPart/contentPartModel";
import { ContentPart } from "./contentPart";


export class ContentPartViewModelBinder implements ViewModelBinder<ContentPartModel, ContentPart> {
    public async modelToViewModel(model: ContentPartModel): Promise<ContentPart> {
        return new ContentPart(model.message);
    }
    public canHandleModel(model: ContentPartModel): boolean {
        return model instanceof ContentPartModel;
    }
}