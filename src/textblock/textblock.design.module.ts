import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ComponentFlow } from "@paperbits/common/editing";
import { TextblockHandlers } from "./textblockHandlers";
import { BlockStyleSelector } from "./ko/formatting/blockStyleSelector";
import { TextBlockEditorFormattingTools } from "./ko/formatting/formattingTools";
import { TextBlockEditorHyperlinkTools } from "./ko/hyperlink/hyperlinkTools";
import { TextblockEditor } from "./ko/textblockEditor";
import { TextStyleSelector } from "./ko/formatting/textStyleSelector";
import { TextblockModelBinder } from "./textblockModelBinder";
import { TextblockViewModelBinder } from "./textblockViewModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { TextblockModel } from "./textblockModel";
import { TextblockViewModel } from "./ko";
import { InlineModelBinder } from "../text/modelBinders/inlineModelBinder";
import { BlockModelBinder } from "../text/modelBinders/blockModelBinder";
import { ListModelBinder } from "../text/modelBinders/listModelBinder";
import { HtmlEditorBindingHandler } from "../ko/bindingHandlers";

export class TextblockDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("textblock", TextblockViewModel);
        injector.bindToCollection("modelBinders", InlineModelBinder);
        injector.bindToCollection("modelBinders", BlockModelBinder);
        injector.bindToCollection("modelBinders", ListModelBinder);
        injector.bindToCollection("autostart", HtmlEditorBindingHandler);

        injector.bindInstance("textblockEditorPlugins", [
            "text-block-editor-formatting",
            "text-block-editor-hyperlinks"
        ]);
        injector.bind("formattingTools", TextBlockEditorFormattingTools);
        injector.bind("hyperlinkEditor", TextBlockEditorHyperlinkTools);
        injector.bind("textblockEditor", TextblockEditor);
        injector.bind("blockStyleSelector", BlockStyleSelector);
        injector.bind("textStyleSelector", TextStyleSelector);

        injector.bindSingleton("textblockModelBinder", TextblockModelBinder);
        injector.bindSingleton("textblockViewModelBinder", TextblockViewModelBinder)
        injector.bindSingleton("textblockHandler", TextblockHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("text-block", {
            modelClass: TextblockModel,
            componentFlow: ComponentFlow.Block,
            componentBinder: "knockout",
            componentBinderArguments: TextblockViewModel,
            modelBinder: TextblockModelBinder,
            viewModelBinder: TextblockViewModelBinder
        });

        widgetService.registerWidgetEditor("text-block", {
            displayName: "Text",
            iconClass: "widget-icon widget-icon-text-block",
            draggable: true,
            editorComponent: TextblockEditor,
            handlerComponent: TextblockHandlers
        });
    }
}