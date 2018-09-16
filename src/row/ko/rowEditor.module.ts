import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewManager } from "@paperbits/common/ui";
import { RowLayoutSelector } from "./rowLayoutSelector";

export class RowEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindComponent("rowLayoutSelector", (ctx: IInjector, params: {}) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            return new RowLayoutSelector(viewManager, params["onSelect"]);
        });
    }
}