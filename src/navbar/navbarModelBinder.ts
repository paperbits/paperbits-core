import { NavbarModel } from "./navbarModel";
import { NavbarContract } from "./navbarContract";
import { IModelBinder } from "@paperbits/common/editing";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPermalinkService, IPermalinkResolver } from "@paperbits/common/permalinks";
import { IRouteHandler } from "@paperbits/common/routing";
import { Contract } from "@paperbits/common/contract";

export class NavbarModelBinder implements IModelBinder {
    constructor(
        private readonly navigationService: INavigationService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly permalinkResolver: IPermalinkResolver) {
    }

    public async contractToModel(navbarContract: NavbarContract): Promise<NavbarModel> {
        const navbarModel = new NavbarModel();
        const navigationItemContract = await this.navigationService.getNavigationItem(navbarContract.rootKey);
        const navbarItemModel = await this.navigationItemToNavbarItemModel(navigationItemContract);

        navbarModel.root = navbarItemModel;
        navbarModel.rootKey = navbarContract.rootKey;
        navbarModel.pictureSourceKey = navbarContract.rootKey;

        if (navbarContract.pictureSourceKey) {
            try {
                navbarModel.pictureSourceUrl = await this.permalinkResolver.getUrlByPermalinkKey(navbarContract.pictureSourceKey);
                navbarModel.pictureSourceKey = navbarContract.pictureSourceKey;
            }
            catch (error) {
                console.log(error);
            }
        }

        return navbarModel;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "navbar";
    }

    public canHandleModel(model): boolean {
        return model instanceof NavbarModel;
    }

    public async navigationItemToNavbarItemModel(navigationItemContract: NavigationItemContract): Promise<NavigationItemModel> {
        const navbarItem = new NavigationItemModel();

        navbarItem.label = navigationItemContract.label;

        if (navigationItemContract.navigationItems) {
            const tasks = [];

            navigationItemContract.navigationItems.forEach(child => {
                tasks.push(this.navigationItemToNavbarItemModel(child));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navbarItem.nodes.push(child);
            });
        }
        else if (navigationItemContract.permalinkKey) {
            const permalink = await this.permalinkService.getPermalinkByKey(navigationItemContract.permalinkKey);
            navbarItem.url = permalink.uri;
        }
        else {
            console.warn(`No permalink key for item:`);
            console.warn(navigationItemContract);
        }
        navbarItem.isActive = (navbarItem.url === this.routeHandler.getCurrentUrl());

        return navbarItem;
    }

    public modelToContract(navbarModel: NavbarModel): Contract {
        const navbarContract: NavbarContract = {
            object: "block",
            type: "navbar",
            rootKey: navbarModel.rootKey,
            pictureSourceKey: navbarModel.pictureSourceKey
        };

        return navbarContract;
    }
}