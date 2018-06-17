import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ColumnModule } from "./column.module";
import { ColumnEditor } from "./columnEditor";

export class ColumnEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new ColumnModule(this.modelBinders, this.viewModelBinders));
        
        injector.bind("columnEditor", ColumnEditor);
    }
}