import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewManager } from "@paperbits/common/ui";
import { NavigationWorkshop } from "./navigation";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { INavigationService } from "@paperbits/common/navigation";
import { NavigationDetailsWorkshop } from "./navigationDetails";
import { NavigationItemSelector } from "./navigationItemSelector";

export class NavigationWorkshopModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("navigationWorkshop", NavigationWorkshop);

        injector.bindComponent("navigationDetailsWorkshop", (ctx: IInjector, params) => {
            const permalinkResolver = ctx.resolve<IPermalinkResolver>("permalinkResolver");
            const navigationService = ctx.resolve<INavigationService>("navigationService");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new NavigationDetailsWorkshop(permalinkResolver, viewManager, params);
        });

        injector.bindComponent("navigationItemSelector", (ctx: IInjector, params: {}) => {
            const navigationService = ctx.resolve<INavigationService>("navigationService");
            return new NavigationItemSelector(navigationService, params["onSelect"]);
        });
    }
}