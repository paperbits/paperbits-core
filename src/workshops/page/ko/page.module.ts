import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IPageService } from "@paperbits/common/pages";
import { PagesWorkshop } from "./pages";
import { PageDetailsWorkshop } from "./pageDetails";
import { PageSelector } from "./pageSelector";

export class PageWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {                
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