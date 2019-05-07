import { TableOfContentsModel } from "./tableOfContentsModel";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPageService } from "@paperbits/common/pages";
import { IModelBinder } from "@paperbits/common/editing";
import { IRouteHandler } from "@paperbits/common/routing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { TableOfContentsContract } from "./tableOfContentsContract";
import { Contract } from "@paperbits/common";
import { AnchorUtils } from "../text/anchorUtils";
import { BlockContract } from "../text/contracts";

export class TableOfContentsModelBinder implements IModelBinder {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly navigationService: INavigationService,
        private readonly pageService: IPageService,
        private readonly routeHandler: IRouteHandler
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "table-of-contents";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableOfContentsModel;
    }

    private processAnchorItems(items: BlockContract[]): NavigationItemModel[] {
        return items.map((item) => {
            const itemModel = new NavigationItemModel();
            itemModel.label = item.nodes[0].text;
            itemModel.url = `#${item.attrs.id}`;
            return itemModel;
        });
    }

    private async processNavigationItem(navigationItem: NavigationItemContract, currentPageUrl: string, maxHeading?: number): Promise<NavigationItemModel> {
        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = navigationItem.label;

        if (navigationItem.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(navigationItem.targetKey);

            if (contentItem) {
                navbarItemModel.url = contentItem.permalink;

                if (contentItem.permalink === currentPageUrl) {
                    navbarItemModel.isActive = true;
    
                    if (contentItem.key && contentItem.key.startsWith("pages/")) {
                        const pageContent = await this.pageService.getPageContent(contentItem.key);
                        const children = AnchorUtils.getHeadingNodes(pageContent, maxHeading);
    
                        if (children.length > 0) {
                            navbarItemModel.nodes = this.processAnchorItems(children);
                        }
                    }
                }
            }
        }

        return navbarItemModel;
    }

    public async contractToModel(contract: TableOfContentsContract): Promise<TableOfContentsModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const tableOfContentsModel = new TableOfContentsModel();
        tableOfContentsModel.title = contract.title;
        tableOfContentsModel.navigationItemKey = contract.navigationItemKey;
        tableOfContentsModel.maxHeading = contract.maxHeading || 1;
        tableOfContentsModel.items = [];

        const currentPageUrl = this.routeHandler.getPath();

        if (contract.navigationItemKey) {
            const assignedNavigationItem = await this.navigationService.getNavigationItem(contract.navigationItemKey);
            tableOfContentsModel.title = tableOfContentsModel.title || assignedNavigationItem.label;
            if (assignedNavigationItem && assignedNavigationItem.navigationItems) { // has child nav items
                const promises = assignedNavigationItem.navigationItems.map(async navigationItem => {
                    return await this.processNavigationItem(navigationItem, currentPageUrl, tableOfContentsModel.maxHeading);
                });

                const results = await Promise.all(promises);

                tableOfContentsModel.items = results;
            }
        }

        return tableOfContentsModel;
    }

    public modelToContract(model: TableOfContentsModel): Contract {
        const contract: TableOfContentsContract = {
            type: "table-of-contents",
            title: model.title,
            maxHeading: model.maxHeading,
            navigationItemKey: model.navigationItemKey
        };

        return contract;
    }
}
