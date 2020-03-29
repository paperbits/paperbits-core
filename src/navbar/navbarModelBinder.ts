import { Bag } from "@paperbits/common";
import { Contract } from "@paperbits/common/contract";
import { IModelBinder } from "@paperbits/common/editing";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { Router } from "@paperbits/common/routing";
import { NavbarContract } from "./navbarContract";
import { NavbarModel } from "./navbarModel";


export class NavbarModelBinder implements IModelBinder<NavbarModel> {
    constructor(
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly navigationService: INavigationService,
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly router: Router
    ) { }

    public async contractToModel(contract: NavbarContract, bindingContext: Bag<any>): Promise<NavbarModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const navbarModel = new NavbarModel();
        const navigationItemContract = await this.navigationService.getNavigationItem(contract.rootKey);

        if (navigationItemContract) {
            const navbarItemModel = await this.navigationItemToNavbarItemModel(navigationItemContract, bindingContext?.locale);
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

    public async navigationItemToNavbarItemModel(contract: NavigationItemContract, locale: string): Promise<NavigationItemModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const navigationItem = new NavigationItemModel();

        navigationItem.label = contract.label;

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.navigationItemToNavbarItemModel(child, locale));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navigationItem.nodes.push(child);
            });
        }
        else if (contract.targetKey) {
            const targetUrl = await this.permalinkResolver.getUrlByTargetKey(contract.targetKey, locale);
            navigationItem.targetUrl = targetUrl;
        }
        else {
            console.warn(`Navigation item "${navigationItem.label}" has no permalink assigned to it.`);
        }
        navigationItem.isActive = navigationItem.targetUrl === this.router.getPath();

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