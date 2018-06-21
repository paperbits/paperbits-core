import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ColumnEditor } from "./columnEditor";

export class ColumnEditorModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("columnEditor", ColumnEditor);
    }
}