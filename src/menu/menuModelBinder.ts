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
import { LocalStyles } from "@paperbits/common/styles";


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

    private async processNavigationItem(contract: NavigationItemContract, permalink: string, minHeading: number, maxHeading: number, level: number = 0): Promise<NavigationItemModel> {
        const navitemModel = new NavigationItemModel();
        navitemModel.label = contract.label;

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.processNavigationItem(child, permalink, minHeading, maxHeading, level + 1));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navitemModel.nodes.push(child);
            });
        }

        if (!contract.targetKey) {
            return navitemModel;
        }

        const contentItem = await this.contentItemService.getContentItemByKey(contract.targetKey);

        if (!contentItem) {
            return navitemModel;
        }

        navitemModel.targetUrl = contentItem.permalink;

        if (contentItem.permalink === permalink) {
            navitemModel.isActive = true;
        }

        if (level > 0 && minHeading && maxHeading && navitemModel.targetUrl === permalink) {
            const localNavItems = await this.processAnchorItems(permalink, minHeading, maxHeading);
            navitemModel.nodes.push(...localNavItems);
        }

        return navitemModel;
    }

    private async processAnchorItems(permalink: string, minHeading: number, maxHeading?: number): Promise<NavigationItemModel[]> {
        const page = await this.pageService.getPageByPermalink(permalink);
        const pageContent = await this.pageService.getPageContent(page.key);
        const children = AnchorUtils.getHeadingNodes(pageContent, minHeading, maxHeading);

        if (children.length === 0) {
            return [];
        }

        return children.map((item: BlockContract) => {
            const itemModel = new NavigationItemModel();
            itemModel.label = item.nodes[0].text;
            itemModel.targetUrl = `#${item.attrs.id || item.attrs.key}`;
            return itemModel;
        });
    }

    public async contractToModel(contract: MenuContract, bindingContext?: Bag<any>): Promise<MenuModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const menuModel = new MenuModel();
        menuModel.minHeading = contract.minHeading;
        menuModel.maxHeading = contract.maxHeading;
        menuModel.items = [];
        menuModel.layout = contract.layout;
        menuModel.roles = contract.roles || [BuiltInRoles.everyone.key];
        menuModel.styles = contract.styles || { appearance: "components/menu/default" };

        const currentPageUrl = bindingContext?.navigationPath;

        if (contract.navigationItemKey) {
            const rootNavigationItem = await this.navigationService.getNavigationItem(contract.navigationItemKey);

            if (rootNavigationItem) {
                const root = await this.processNavigationItem(rootNavigationItem, currentPageUrl, menuModel.minHeading, menuModel.maxHeading);
                menuModel.items = root.nodes;
                menuModel.navigationItem = root;
                menuModel.navigationItem.key = contract.navigationItemKey;
            }
        }

        if (menuModel.items.length === 0 && menuModel.minHeading && menuModel.maxHeading) {
            const localNavItems = await this.processAnchorItems(currentPageUrl, menuModel.minHeading, menuModel.maxHeading);
            menuModel.items.push(...localNavItems);
        }

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
            navigationItemKey: model.navigationItem?.key,
            layout: model.layout,
            styles: model.styles,
            roles: roles
        };


        return contract;
    }
}
