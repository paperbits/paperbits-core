import { TableOfContentsModel } from "./tableOfContentsModel";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPermalink, IPermalinkService } from "@paperbits/common/permalinks";
import { IModelBinder } from "@paperbits/common/editing";
import { IRouteHandler } from "@paperbits/common/routing";
import { TableOfContentsContract } from "./tableOfContentsContract";
import { Contract } from "@paperbits/common";
import { IPageService } from "@paperbits/common/pages";


export class TableOfContentsModelBinder implements IModelBinder {
    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly navigationService: INavigationService,
        private readonly routeHandler: IRouteHandler
    ) {
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "table-of-contents";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableOfContentsModel;
    }

    private async processAnchorItems(permalink: IPermalink, anchors): Promise<NavigationItemModel[]> {
        const anchorPromises = Object.keys(anchors).map(async anchorKey => {
            const permalinkKey = anchorKey.replaceAll("|", "/");
            const anchorPermalink = await this.permalinkService.getPermalink(permalinkKey);

            const anchorNavbarItem = new NavigationItemModel();
            anchorNavbarItem.label = anchors[anchorKey]; //`${page.title} > ${page.anchors[anchorKey]}`;

            // Bootstrap ScrollSpy works only with hash URLs
            // anchorNavbarItem.url = `${permalink.uri}#${anchorPermalink.uri}`;
            anchorNavbarItem.url = `#${anchorPermalink.uri}`;

            return anchorNavbarItem;
        });

        const results = await Promise.all(anchorPromises);

        return results;
    }

    private async processNavigationItem(navigationItem: NavigationItemContract, currentPageUrl: string): Promise<NavigationItemModel> {
        const permalink = await this.permalinkService.getPermalinkByKey(navigationItem.permalinkKey);

        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = navigationItem.label;
        navbarItemModel.url = permalink.uri;

        if (permalink.uri === currentPageUrl) {
            navbarItemModel.isActive = true;

            const page = await this.pageService.getPageByKey(permalink.targetKey);

            if (page.anchors) {
                navbarItemModel.nodes = await this.processAnchorItems(permalink, page.anchors);
            }
        }

        return navbarItemModel;
    }

    public async nodeToModel(tableOfContentsContract: TableOfContentsContract): Promise<TableOfContentsModel> {
        const type = "table-of-contents";

        const tableOfContentsModel = new TableOfContentsModel();
        tableOfContentsModel.title = tableOfContentsContract.title;
        tableOfContentsModel.navigationItemKey = tableOfContentsContract.navigationItemKey;
        tableOfContentsModel.items = [];

        const currentPageUrl = this.routeHandler.getCurrentUrl();
        const currentPagePermalink = await this.permalinkService.getPermalinkByUrl(currentPageUrl);
        const page = await this.pageService.getPageByKey(currentPagePermalink.targetKey);

        if (tableOfContentsContract.navigationItemKey) {
            const assignedNavigationItem = await this.navigationService.getNavigationItem(tableOfContentsContract.navigationItemKey);

            if (assignedNavigationItem.navigationItems) { // has child nav items
                const promises = assignedNavigationItem.navigationItems.map(async navigationItem => {
                    return await this.processNavigationItem(navigationItem, currentPageUrl);
                })

                const results = await Promise.all(promises);

                tableOfContentsModel.items = results;
            }
            else {
                const permalink = await this.permalinkService.getPermalinkByKey(assignedNavigationItem.permalinkKey);

                if (permalink.uri === currentPageUrl) {
                    if (page.anchors) {
                        const anchors = await this.processAnchorItems(currentPagePermalink, page.anchors);
                        tableOfContentsModel.items = anchors;
                    }
                }
            }
        }
        else {
            if (page.anchors) {
                const anchors = await this.processAnchorItems(currentPagePermalink, page.anchors);
                tableOfContentsModel.items = anchors;
            }
        }

        return tableOfContentsModel;
    }

    public getConfig(tableOfContentsModel: TableOfContentsModel): Contract {
        const tableOfContentsConfig: TableOfContentsContract = {
            object: "block",
            type: "table-of-contents",
            title: tableOfContentsModel.title,
            navigationItemKey: tableOfContentsModel.navigationItemKey
        };

        return tableOfContentsConfig;
    }
}
