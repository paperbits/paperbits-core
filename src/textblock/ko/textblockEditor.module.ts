import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TextblockHandlers } from "../textblockHandlers";
import { BlockStyleSelector } from "./formatting/blockStyleSelector";
import { FormattingTools } from "./formatting/formattingTools";
import { HyperlinkEditor } from "./hyperlink/hyperlinkEditor";
import { TextblockEditor } from "./textblockEditor";
import { TextStyleSelector } from "./formatting/textStyleSelector";

export class TextblockEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TextblockHandlers, "textblockHandler");
        injector.bind("formattingTools", FormattingTools);
        injector.bind("hyperlinkEditor", HyperlinkEditor);
        injector.bind("textblockEditor", TextblockEditor);
        injector.bind("blockStyleSelector", BlockStyleSelector);
        injector.bind("textStyleSelector", TextStyleSelector);
    }
}