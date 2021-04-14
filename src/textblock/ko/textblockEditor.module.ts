import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TextblockHandlers } from "../textblockHandlers";
import { BlockStyleSelector } from "./formatting/blockStyleSelector";
import { TextBlockEditorFormattingTools } from "./formatting/formattingTools";
import { TextBlockEditorHyperlinkTools } from "./hyperlink/hyperlinkTools";
import { TextblockEditor } from "./textblockEditor";
import { TextStyleSelector } from "./formatting/textStyleSelector";

export class TextblockEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindInstance("textblockEditorPlugins", [
            "text-block-editor-formatting",
            "text-block-editor-hyperlinks"
        ]);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TextblockHandlers, "textblockHandler");
        injector.bind("formattingTools", TextBlockEditorFormattingTools);
        injector.bind("hyperlinkEditor", TextBlockEditorHyperlinkTools);
        injector.bind("textblockEditor", TextblockEditor);
        injector.bind("blockStyleSelector", BlockStyleSelector);
        injector.bind("textStyleSelector", TextStyleSelector);
    }
}