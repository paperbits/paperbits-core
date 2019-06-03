import { NavbarModel } from "./navbarModel";
import { NavbarContract } from "./navbarContract";
import { IModelBinder } from "@paperbits/common/editing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IRouteHandler } from "@paperbits/common/routing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { Contract } from "@paperbits/common/contract";


export class NavbarModelBinder implements IModelBinder<NavbarModel> {
    constructor(
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly navigationService: INavigationService,
        private readonly contentItemService: IContentItemService,
        private readonly routeHandler: IRouteHandler
    ) { }

    public async contractToModel(contract: NavbarContract): Promise<NavbarModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const navbarModel = new NavbarModel();
        const navigationItemContract = await this.navigationService.getNavigationItem(contract.rootKey);

        if (navigationItemContract) {
            const navbarItemModel = await this.navigationItemToNavbarItemModel(navigationItemContract);
            navbarModel.root = navbarItemModel;
        }

        navbarModel.rootKey = contract.rootKey;
        navbarModel.pictureSourceKey = contract.pictureSourceKey;

        if (contract.pictureSourceKey) {
            navbarModel.pictureSourceKey = contract.pictureSourceKey;
            navbarModel.pictureSourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(contract.pictureSourceKey);
            navbarModel.pictureWidth = contract.pictureWidth;
            navbarModel.pictureHeight = contract.pictureHeight;

            if (!navbarModel.pictureSourceUrl) {
                console.warn(`Unable to set navbar branding. Media with source key ${contract.pictureSourceKey} not found.`);
            }
        }

        navbarModel.styles = contract.styles || { appearance: "components/navbar/default" };

        return navbarModel;
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "navbar";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof NavbarModel;
    }

    public async navigationItemToNavbarItemModel(contract: NavigationItemContract): Promise<NavigationItemModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const navigationItem = new NavigationItemModel();

        navigationItem.label = contract.label;

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.navigationItemToNavbarItemModel(child));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navigationItem.nodes.push(child);
            });
        }
        else if (contract.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(contract.targetKey);

            if (contentItem) {
                navigationItem.url = contentItem.permalink;
            }
        }
        else {
            console.warn(`Navigation item "${navigationItem.label}" has no permalink assigned to it.`);
        }
        navigationItem.isActive = navigationItem.url === this.routeHandler.getPath();

        return navigationItem;
    }

    public modelToContract(navbarModel: NavbarModel): Contract {
        const navbarContract: NavbarContract = {
            type: "navbar",
            rootKey: navbarModel.rootKey,
            pictureSourceKey: navbarModel.pictureSourceKey,
            pictureWidth: navbarModel.pictureWidth,
            pictureHeight: navbarModel.pictureHeight,
            styles: navbarModel.styles
        };

        return navbarContract;
    }
}