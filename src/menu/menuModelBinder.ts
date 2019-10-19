import { Contract, Bag } from "@paperbits/common";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPageService } from "@paperbits/common/pages";
import { IModelBinder } from "@paperbits/common/editing";
import { BuiltInRoles } from "@paperbits/common/user";
import { IContentItemService } from "@paperbits/common/contentItems";
import { MenuContract } from "./menuContract";
import { AnchorUtils } from "../text/anchorUtils";
import { BlockContract } from "../text/contracts";
import { MenuModel } from "./menuModel";


export class MenuModelBinder implements IModelBinder<MenuModel> {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly navigationService: INavigationService,
        private readonly pageService: IPageService
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "menu";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof MenuModel;
    }

    private async processNavigationItem(contract: NavigationItemContract, currentPageUrl: string, minHeading: number, maxHeading?: number): Promise<NavigationItemModel> {
        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = contract.label;

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.processNavigationItem(child, currentPageUrl, minHeading, maxHeading));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navbarItemModel.nodes.push(child);
            });
        }

        if (!contract.targetKey) {
            return navbarItemModel;
        }

        const contentItem = await this.contentItemService.getContentItemByKey(contract.targetKey);

        if (!contentItem) {
            return navbarItemModel;
        }

        navbarItemModel.targetUrl = contentItem.permalink;

        if (contentItem.permalink === currentPageUrl) {
            navbarItemModel.isActive = true;

            if (minHeading && maxHeading) {
                navbarItemModel.nodes = await this.processAnchorItems(contentItem.key, minHeading, maxHeading);
            }
        }

        return navbarItemModel;
    }

    private async processAnchorItems(contentItemKey: string, minHeading: number, maxHeading?: number): Promise<NavigationItemModel[]> {
        if (!contentItemKey.startsWith("pages/")) { // TODO: Get rid of hardcoded values.
            return [];
        }
        const pageContent = await this.pageService.getPageContent(contentItemKey);
        const children = AnchorUtils.getHeadingNodes(pageContent, minHeading, maxHeading);

        if (children.length === 0) {
            return [];
        }

        return children.map((item: BlockContract) => {
            const itemModel = new NavigationItemModel();
            itemModel.label = item.nodes[0].text;
            itemModel.targetUrl = `#${item.attrs.id}`;
            return itemModel;
        });
    }

    public async contractToModel(contract: MenuContract, bindingContext?: Bag<any>): Promise<MenuModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const menuModel = new MenuModel();
        menuModel.navigationItemKey = contract.navigationItemKey;
        menuModel.minHeading = contract.minHeading;
        menuModel.maxHeading = contract.maxHeading;
        menuModel.items = [];
        menuModel.layout = contract.layout;
        menuModel.roles = contract.roles || [BuiltInRoles.everyone.key];
        menuModel.styles = contract.styles || { appearance: "components/menu/default" };

        if (!contract.navigationItemKey) {
            return menuModel;
        }

        const currentPageUrl = bindingContext.navigationPath;

        const rootNavigationItem = await this.navigationService.getNavigationItem(contract.navigationItemKey);
        menuModel.title = menuModel.title || rootNavigationItem.label;

        if (!rootNavigationItem || !rootNavigationItem.navigationItems) {
            return menuModel;
        }

        const promises = rootNavigationItem.navigationItems.map(async navigationItem =>
            await this.processNavigationItem(navigationItem, currentPageUrl, menuModel.minHeading, menuModel.maxHeading));

        const results = await Promise.all(promises);
        menuModel.items = results;

        return menuModel;
    }

    public modelToContract(model: MenuModel): Contract {
        const roles = model.roles
            && model.roles.length === 1
            && model.roles[0] === BuiltInRoles.everyone.key
            ? null
            : model.roles;

        const contract: MenuContract = {
            type: "menu",
            minHeading: model.minHeading,
            maxHeading: model.maxHeading,
            navigationItemKey: model.navigationItemKey,
            layout: model.layout,
            styles: model.styles,
            roles: roles
        };

        return contract;
    }
}
