import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { LayoutModule } from "../../../layout/ko/layout.module";
import { LayoutsWorkshop } from "./layouts";
import { LayoutDetails } from "./layoutDetails";
import { LayoutSelector } from "./layoutSelector";

export class LayoutWorkshopModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new LayoutModule(this.modelBinders, this.viewModelBinders));
        
        injector.bind("layoutsWorkshop", LayoutsWorkshop);

        injector.bindComponent("layoutDetails", (ctx: IInjector, params) => {
            const layoutService = ctx.resolve<ILayoutService>("layoutService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new LayoutDetails(layoutService, routeHandler, viewManager, params);
        });

        injector.bindComponent("layoutSelector", (ctx: IInjector, params: {}) => {
            const layoutService = ctx.resolve<ILayoutService>("layoutService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new LayoutSelector(layoutService, params["onSelect"]);
        });
    }
}