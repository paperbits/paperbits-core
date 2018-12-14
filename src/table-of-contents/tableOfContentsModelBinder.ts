import { TableOfContentsModel } from "./tableOfContentsModel";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IModelBinder } from "@paperbits/common/editing";
import { IRouteHandler } from "@paperbits/common/routing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { TableOfContentsContract } from "./tableOfContentsContract";
import { Contract } from "@paperbits/common";


export class TableOfContentsModelBinder implements IModelBinder {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly navigationService: INavigationService,
        private readonly routeHandler: IRouteHandler
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "table-of-contents";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableOfContentsModel;
    }

    // private async processAnchorItems(anchors): Promise<NavigationItemModel[]> {
    //     const anchorPromises = Object.keys(anchors).map(async anchorKey => {
    //         const permalinkKey = anchorKey.replaceAll("|", "/");
    //         const anchorPermalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

    //         const anchorNavbarItem = new NavigationItemModel();
    //         anchorNavbarItem.label = anchors[anchorKey]; //`${page.title} > ${page.anchors[anchorKey]}`;

    //         // Bootstrap ScrollSpy works only with hash URLs
    //         // anchorNavbarItem.url = `${permalink.uri}#${anchorPermalink.uri}`;
    //         anchorNavbarItem.url = `#${anchorPermalink.uri}`;

    //         return anchorNavbarItem;
    //     });

    //     const results = await Promise.all(anchorPromises);

    //     return results;
    // }

    private async processNavigationItem(navigationItem: NavigationItemContract, currentPageUrl: string): Promise<NavigationItemModel> {
        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = navigationItem.label;

        if (navigationItem.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(navigationItem.targetKey);
            
            navbarItemModel.url = contentItem.permalink;

            if (contentItem.permalink === currentPageUrl) {
                navbarItemModel.isActive = true;
    
                if (contentItem.anchors) {
                    // navbarItemModel.nodes = await this.processAnchorItems(page.anchors);
                }
            }
        }

        return navbarItemModel;
    }

    public async contractToModel(tableOfContentsContract: TableOfContentsContract): Promise<TableOfContentsModel> {
        const tableOfContentsModel = new TableOfContentsModel();
        tableOfContentsModel.title = tableOfContentsContract.title;
        tableOfContentsModel.navigationItemKey = tableOfContentsContract.navigationItemKey;
        tableOfContentsModel.items = [];

        // const currentPageUrl = this.routeHandler.getCurrentUrl();
        // const currentPagePermalink = await this.permalinkService.getPermalinkByUrl(currentPageUrl);

        // let page: PageContract;

        // if (currentPagePermalink) {
        //     page = await this.pageService.getPageByKey(currentPagePermalink.targetKey);
        // }

        // if (tableOfContentsContract.navigationItemKey) {
        //     const assignedNavigationItem = await this.navigationService.getNavigationItem(tableOfContentsContract.navigationItemKey);

        //     if (assignedNavigationItem.navigationItems) { // has child nav items
        //         const promises = assignedNavigationItem.navigationItems.map(async navigationItem => {
        //             return await this.processNavigationItem(navigationItem, currentPageUrl);
        //         });

        //         const results = await Promise.all(promises);

        //         tableOfContentsModel.items = results;
        //     }
        //     else {
        //         const permalink = await this.permalinkService.getPermalinkByKey(assignedNavigationItem.permalinkKey);

        //         if (permalink.uri === currentPageUrl) {
        //             if (page && page.anchors) {
        //                 const anchors = await this.processAnchorItems(page.anchors);
        //                 tableOfContentsModel.items = anchors;
        //             }
        //         }
        //     }
        // }
        // else {
        //     if (page && page.anchors) {
        //         const anchors = await this.processAnchorItems(page.anchors);
        //         tableOfContentsModel.items = anchors;
        //     }
        // }

        return tableOfContentsModel;
    }

    public modelToContract(tableOfContentsModel: TableOfContentsModel): Contract {
        const tableOfContentsConfig: TableOfContentsContract = {
            object: "block",
            type: "table-of-contents",
            title: tableOfContentsModel.title,
            navigationItemKey: tableOfContentsModel.navigationItemKey
        };

        return tableOfContentsConfig;
    }
}
