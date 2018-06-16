import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { PageModule } from "./page.module";
import { PagesWorkshop } from "./workshop/pages";
import { IPageService } from "@paperbits/common/pages";
import { PageDetailsWorkshop } from "./workshop/pageDetails";
import { PageSelector } from "./workshop/pageSelector";

export class PageEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new PageModule(this.modelBinders, this.viewModelBinders));
                
        injector.bind("pagesWorkshop", PagesWorkshop);

        injector.bindComponent("pageDetailsWorkshop", (ctx: IInjector, params) => {
            const pageService = ctx.resolve<IPageService>("pageService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new PageDetailsWorkshop(pageService, permalinkService, routeHandler, viewManager, params);
        });

        injector.bindComponent("pageSelector", (ctx: IInjector, params: {}) => {
            const pageService = ctx.resolve<IPageService>("pageService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new PageSelector(pageService, permalinkService, params["onSelect"]);
        });
    }
}