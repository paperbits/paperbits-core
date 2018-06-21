import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { TableOfContentsEditor } from "./tableOfContentsEditor";
import { TableOfContentsHandlers } from "../tableOfContentsHandlers";

export class TableOfContentsEditorModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("tableOfContentsEditor", TableOfContentsEditor);
        injector.bindSingleton("tableOfContentsHandlers", TableOfContentsHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<TableOfContentsHandlers>("tableOfContentsHandlers"));
    }
}