import { TextblockModel } from "./textblockModel";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";

export class TextblockViewModelBinder implements IViewModelBinder<TextblockModel, TextblockViewModel> {
    private readonly htmlEditorFactory;

    constructor(htmlEditorFactory, private readonly eventManager: IEventManager) {
        this.htmlEditorFactory = htmlEditorFactory;
    }

    public modelToViewModel(model: TextblockModel, viewModel?: TextblockViewModel): TextblockViewModel {
        if (!viewModel) {
            viewModel = new TextblockViewModel(this.htmlEditorFactory.createHtmlEditor());
        }

        model.htmlEditor = viewModel.htmlEditor;

        viewModel.state(model.state);
        // textblockViewModel.readonly(!!model.readonly);

        const widgetBinding /*: IWidgetBinding */ = {
            displayName: "Text",
            model: model,
            flow: "block",
            editor: "html-editor",
            editorResize: "horizontally",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
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