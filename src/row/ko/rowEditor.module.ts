import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IViewManager } from "@paperbits/common/ui";
import { RowLayoutSelector } from "./rowLayoutSelector";
import { RowModule } from "./row.module";

export class RowEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new RowModule(this.modelBinders, this.viewModelBinders));
        
        injector.bindComponent("rowLayoutSelector", (ctx: IInjector, params: {}) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            return new RowLayoutSelector(viewManager, params["onSelect"]);
        });
    }
}