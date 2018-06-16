import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { BlogModule } from "./blog.module";
import { BlogWorkshop } from "./workshop/blogs";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { BlogPostDetailsWorkshop } from "./workshop/blogPostDetails";
import { BlogSelector } from "./workshop/blogSelector";

export class BlogEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new BlogModule(this.modelBinders));
        
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