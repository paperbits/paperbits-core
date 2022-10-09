import { ComponentFlow } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { HtmlEditorBindingHandler } from "../ko/bindingHandlers";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { BlockModelBinder } from "../text/modelBinders/blockModelBinder";
import { InlineModelBinder } from "../text/modelBinders/inlineModelBinder";
import { ListModelBinder } from "../text/modelBinders/listModelBinder";
import { TextblockViewModel } from "./ko";
import { BlockStyleSelector } from "./ko/formatting/blockStyleSelector";
import { TextBlockEditorFormattingTools } from "./ko/formatting/formattingTools";
import { TextStyleSelector } from "./ko/formatting/textStyleSelector";
import { TextBlockEditorHyperlinkTools } from "./ko/hyperlink/hyperlinkTools";
import { TextblockEditor } from "./ko/textblockEditor";
import { TextblockHandlers } from "./textblockHandlers";
import { TextblockModel } from "./textblockModel";
import { TextblockModelBinder } from "./textblockModelBinder";
import { TextblockViewModelBinder } from "./textblockViewModelBinder";

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
            modelDefinition: TextblockModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TextblockViewModel,
            modelBinder: TextblockModelBinder,
            viewModelBinder: TextblockViewModelBinder
        });

        widgetService.registerWidgetEditor("text-block", {
            displayName: "Text",
            iconClass: "widget-icon widget-icon-text-block",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TextblockEditor,
            handlerComponent: TextblockHandlers,
            editorResizing: "horizontally",
            editorScrolling: false
        });
    }
}