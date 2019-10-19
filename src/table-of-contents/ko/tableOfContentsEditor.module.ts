import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableOfContentsEditor } from "./tableOfContentsEditor";

export class TableOfContentsEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableOfContentsEditor", TableOfContentsEditor);
    }
}