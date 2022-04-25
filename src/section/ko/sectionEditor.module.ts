import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { SectionEditor } from "./sectionEditor";
import { SectionHandlers } from "../sectionHandlers";


export class SectionEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("sectionEditor", SectionEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", SectionHandlers, "sectionHandler");
    }
}