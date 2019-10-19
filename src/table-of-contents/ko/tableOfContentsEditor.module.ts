import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TableOfContentsEditor } from "./tableOfContentsEditor";
import { TableOfContentsHandlers } from "../tableOfContentsHandlers";

export class TableOfContentsEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableOfContentsEditor", TableOfContentsEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TableOfContentsHandlers, "tableOfContentsHandler");
    }
}