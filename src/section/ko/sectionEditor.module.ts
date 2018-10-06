import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { SectionLayoutSelector } from "./sectionLayoutSelector";
import { SectionEditor } from "./sectionEditor";
import { SectionHandlers } from "../sectionHandlers";


export class SectionEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("sectionLayoutSelector", SectionLayoutSelector);
        injector.bind("sectionEditor", SectionEditor);
        injector.bind("sectionHandler", SectionHandlers);

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<SectionHandlers>("sectionHandler"));
    }
}