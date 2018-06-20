import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TextblockModule } from "./textblock.module";
import { TextblockHandlers } from "../textblockHandlers";
import { BlockStyleSelector } from "./formatting/blockStyleSelector";
import { FontSelector } from "./formatting/fontSelector";
import { FormattingTools } from "./formatting/formattingTools";
import { HyperlinkEditor } from "./hyperlink/hyperlinkEditor";
import { TextblockEditor } from "./textblockEditor";

export class TextblockEditorModule implements IInjectorModule {
    constructor(
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new TextblockModule(this.viewModelBinders));
        injector.bindSingleton("textblockHandler", TextblockHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<TextblockHandlers>("textblockHandler"));

        injector.bind("formattingTools", FormattingTools);
        injector.bind("hyperlinkEditor", HyperlinkEditor);
        injector.bind("textblockEditor", TextblockEditor);

        injector.bind("blockStyleSelector", BlockStyleSelector);
        injector.bind("fontSelector", FontSelector);
    }
}