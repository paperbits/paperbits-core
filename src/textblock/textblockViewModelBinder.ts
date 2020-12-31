import { Bag } from "@paperbits/common";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { TextblockModel } from "./textblockModel";


export class TextblockViewModelBinder implements ViewModelBinder<TextblockModel, TextblockViewModel> {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: TextblockModel, viewModel?: TextblockViewModel, bindingContext?: Bag<any>): Promise<TextblockViewModel> {
        if (!viewModel) {
            viewModel = new TextblockViewModel();
        }

        viewModel.state(model.state);

        const widgetBinding: IWidgetBinding<TextblockModel> = {
            name: "text-block",
            displayName: "Text",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "block",
            editor: "html-editor",
            editorResize: "horizontally",
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = widgetBinding;

        return viewModel;
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }
}