import { Bag, Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { ILocaleService } from "@paperbits/common/localization";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { BuiltInRoles } from "@paperbits/common/user";
import { AnchorUtils } from "../text/anchorUtils";
import { BlockContract } from "../text/contracts";
import { MenuContract } from "./menuContract";
import { MenuModel } from "./menuModel";


export class MenuModelBinder implements IModelBinder<MenuModel> {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly navigationService: INavigationService,
        private readonly localeService: ILocaleService
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "menu";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof MenuModel;
    }

    private async getLanguageNavigationMenu(bindingContext: Bag<any>, layout: string): Promise<NavigationItemModel> {
        const locales = await this.localeService.getLocales();
        const currentLocale = await this.localeService.getCurrentLocaleCode();
        const defaultLocale = await this.localeService.getDefaultLocaleCode();
        const requestedLocaleCode = bindingContext?.locale || currentLocale || defaultLocale;
        const requestedLocale = locales.find(x => x.code === requestedLocaleCode);
        const languageNavItems: NavigationItemModel[] = [];

        for (const locale of locales) {
            const targetUrl = bindingContext?.contentItemKey
                ? await this.permalinkResolver.getUrlByTargetKey(bindingContext.contentItemKey, locale.code)
                : "/";

            let isActive = false;

            if (locale.code === requestedLocale.code) {
                if (layout === "horizontal") {
                    continue; // excluding current locale from list in horizontal layout.
                }

                isActive = true;
            }

            const languageNavItem = new NavigationItemModel();
            languageNavItem.label = locale.displayName;
            languageNavItem.targetUrl = targetUrl;
            languageNavItem.isActive = isActive;

            languageNavItems.push(languageNavItem);
        }

        let topLevelChildren;

        switch (layout) {
            case "horizontal":
                topLevelChildren = [{
                    label: requestedLocale.displayName,
                    nodes: languageNavItems
                }];
                break;

            case "vertical":
                topLevelChildren = languageNavItems;
                break;

            default:
                throw new Error(`Unsupported menu widget layout: ${layout}`);
        }

        const topLevelNavItem = new NavigationItemModel();
        topLevelNavItem.label = "Languages";
        topLevelNavItem.nodes = topLevelChildren;

        return topLevelNavItem;
    }

    private async processNavigationItem(locale: string, contract: NavigationItemContract, permalink: string, minHeading: number, maxHeading: number, level: number = 0): Promise<NavigationItemModel> {
        const navitemModel = new NavigationItemModel();
        navitemModel.label = contract.label;

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.processNavigationItem(locale, child, permalink, minHeading, maxHeading, level + 1));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navitemModel.nodes.push(child);
            });
        }

        if (!contract.targetKey) {
            return navitemModel;
        }

        const targetUrl = await this.permalinkResolver.getUrlByTargetKey(contract.targetKey, locale);
        navitemModel.targetUrl = targetUrl;
        navitemModel.targetWindow = contract.targetWindow;
        navitemModel.targetKey = contract.targetKey;
        navitemModel.anchor = contract.anchor;
        navitemModel.triggerEvent = contract.triggerEvent;

        if (targetUrl === permalink) {
            navitemModel.isActive = true;
        }

        if (level > 0 && minHeading && maxHeading && navitemModel.targetUrl === permalink) {
            const localNavItems = await this.processAnchorItems(permalink, locale, minHeading, maxHeading);
            navitemModel.nodes.push(...localNavItems);
        }

        return navitemModel;
    }

    private async processAnchorItems(permalink: string, locale: string, minHeading: number, maxHeading?: number): Promise<NavigationItemModel[]> {
        const content = await this.permalinkResolver.getContentByPermalink(permalink, locale);

        if (!content) {
            // throw new Error(`Unable to fetch content for permalink ${permalink}.`);
            return [];
        }

        const children = AnchorUtils.getHeadingNodes(content, minHeading, maxHeading);

        if (children.length === 0) {
            return [];
        }

        return children.filter(item => item.nodes && item.nodes.length > 0).map((item: BlockContract) => {
            const itemModel = new NavigationItemModel();
            itemModel.label = item.nodes[0].text;
            itemModel.targetUrl = `#${item.identifier || item.attrs?.id || item.attrs?.key}`;
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
            let root: NavigationItemModel;

            if (contract.navigationItemKey === "@locales") {
                root = await this.getLanguageNavigationMenu(bindingContext, menuModel.layout);
            }
            else {
                const rootNavigationItem = await this.navigationService.getNavigationItem(contract.navigationItemKey);

                if (rootNavigationItem) {
                    root = await this.processNavigationItem(bindingContext?.locale, rootNavigationItem, currentPageUrl, menuModel.minHeading, menuModel.maxHeading);
                }
            }

            if (root) {
                menuModel.items = root.nodes;
                menuModel.navigationItem = root;
                menuModel.navigationItem.key = contract.navigationItemKey;
            }
        }

        if (!!currentPageUrl && menuModel.items.length === 0 && menuModel.minHeading && menuModel.maxHeading) {
            const localNavItems = await this.processAnchorItems(currentPageUrl, bindingContext?.locale, menuModel.minHeading, menuModel.maxHeading);
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
