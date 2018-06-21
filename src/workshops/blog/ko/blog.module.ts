import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { BlogWorkshop } from "./blogs";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { BlogPostDetailsWorkshop } from "./blogPostDetails";
import { BlogSelector } from "./blogSelector";

export class BlogWorkshopModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("blogWorkshop", BlogWorkshop);

        injector.bindComponent("blogPostDetailsWorkshop", (ctx: IInjector, params) => {
            const blogService = ctx.resolve<IBlogService>("blogService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new BlogPostDetailsWorkshop(blogService, permalinkService, routeHandler, viewManager, params);
        });

        injector.bindComponent("blogSelector", (ctx: IInjector, params: {}) => {
            const blogService = ctx.resolve<IBlogService>("blogService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new BlogSelector(blogService, permalinkService, params["onSelect"]);
        });
    }
}