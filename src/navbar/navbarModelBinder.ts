import { NavbarModel } from "./navbarModel";
import { NavbarContract } from "./navbarContract";
import { IMediaService } from "@paperbits/common/media";
import { IModelBinder } from "@paperbits/common/editing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IRouteHandler } from "@paperbits/common/routing";
import { Contract } from "@paperbits/common/contract";

export class NavbarModelBinder implements IModelBinder {
    constructor(
        private readonly mediaService: IMediaService,
        private readonly navigationService: INavigationService,
        private readonly contentItemService: IContentItemService,
        private readonly routeHandler: IRouteHandler
    ) { }

    public async contractToModel(navbarContract: NavbarContract): Promise<NavbarModel> {
        const navbarModel = new NavbarModel();
        const navigationItemContract = await this.navigationService.getNavigationItem(navbarContract.rootKey);

        if (navigationItemContract) {
            const navbarItemModel = await this.navigationItemToNavbarItemModel(navigationItemContract);
            navbarModel.root = navbarItemModel;
        }

        navbarModel.rootKey = navbarContract.rootKey;
        navbarModel.pictureSourceKey = navbarContract.rootKey;

        if (navbarContract.sourceKey) {
            const media = await this.mediaService.getMediaByKey(navbarContract.sourceKey);

            if (media) {
                navbarModel.pictureSourceKey = media.key;
                navbarModel.pictureSourceUrl = media.downloadUrl;
            }
            else {
                console.warn(`Unable to set navbar branding. Media with source key ${navbarContract.sourceKey} not found.`);
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
        else if (navigationItemContract.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(navigationItemContract.targetKey);

            if (contentItem) {
                navbarItem.url = contentItem.permalink;
            }

        }
        else {
            console.warn(`No permalink key for item:`);
            console.warn(navigationItemContract);
        }
        navbarItem.isActive = navbarItem.url === this.routeHandler.getCurrentUrl();

        return navbarItem;
    }

    public modelToContract(navbarModel: NavbarModel): Contract {
        const navbarContract: NavbarContract = {
            object: "block",
            type: "navbar",
            rootKey: navbarModel.rootKey,
            sourceKey: navbarModel.pictureSourceKey
        };

        return navbarContract;
    }
}