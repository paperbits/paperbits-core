import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TableOfContentsModule } from "./tableOfContents.module";
import { TableOfContentsEditor } from "./tableOfContentsEditor";
import { TableOfContentsHandlers } from "../tableOfContentsHandlers";

export class TableOfContentsEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new TableOfContentsModule(this.modelBinders, this.viewModelBinders));

        injector.bind("tableOfContentsEditor", TableOfContentsEditor);
        injector.bindSingleton("tableOfContentsHandlers", TableOfContentsHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<TableOfContentsHandlers>("tableOfContentsHandlers"));
    }
}