import { TableOfContentsModel } from "./tableOfContentsModel";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPageService } from "@paperbits/common/pages";
import { IModelBinder } from "@paperbits/common/editing";
import { IRouteHandler } from "@paperbits/common/routing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { TableOfContentsContract } from "./tableOfContentsContract";
import { Contract } from "@paperbits/common";
import * as Utils from "@paperbits/common/utils";

interface ITextNode {
    content: { text: string; type: string; }[];
    type: string;
  }


export class TableOfContentsModelBinder implements IModelBinder {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly navigationService: INavigationService,
        private readonly pageService: IPageService,
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

    private processAnchorItems(items: ITextNode[]): NavigationItemModel[] {
        // let checkLevel = 1;
        // const resultNodes = [];
        // let lastItem;
        // for (let i = 0; i < items.length; i++) {
        //     const item = items[i];
        //     const itemModel = new NavigationItemModel();
        //     itemModel.label = item.content[0].text;
        //     itemModel.url = `#${Utils.slugify(itemModel.label)}`;

        //     const currentLevel = +item.content[0].type.slice(-1);
        //     if (i === 0) {
        //         resultNodes.push(item);
        //         checkLevel = currentLevel;
        //     } else {
        //         if (checkLevel === currentLevel) {
        //             resultNodes.push(item);
        //         } else {
        //             if (checkLevel < currentLevel) {
        //                 resultNodes[resultNodes.length - 1].nodes.push(item);
        //             } else {
                        
        //             }
        //         }
                
        //     }
        //     lastItem = item;
        // }
        // return resultNodes;

        return items.map((item) => {
            const itemModel = new NavigationItemModel();
            itemModel.label = item.content[0].text;
            itemModel.url = `#${Utils.slugify(itemModel.label)}`;
            return itemModel;
        });
    }

    private async processNavigationItem(navigationItem: NavigationItemContract, currentPageUrl: string, maxHeading?: number): Promise<NavigationItemModel> {
        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = navigationItem.label;

        if (navigationItem.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(navigationItem.targetKey);

            navbarItemModel.url = contentItem.permalink;

            if (contentItem.permalink === currentPageUrl) {
                navbarItemModel.isActive = true;

                if (contentItem.key && contentItem.key.startsWith("pages/")) {
                    const pageContent = await this.pageService.getPageContent(contentItem.key);
                    const children = this.findNodesRecursively(pageContent, 
                        node => node["type"] && node["type"].startsWith("heading"), 
                        (node) => {
                            if (node instanceof Array) {
                                return true;
                            }
                            if (!node["type"]) {
                                return false;
                            }

                            const nodeType: string = node["type"];

                            if (nodeType === "layout-section" || nodeType === "layout-row" || nodeType === "layout-column" || nodeType === "text" ||
                                (nodeType.startsWith("heading") && maxHeading >= +nodeType.slice(-1))) {
                                return true;
                            }

                            return false;
                        }
                    );
                    
                    if (children.length > 0) {
                        navbarItemModel.nodes = this.processAnchorItems(children);
                    }
                }
            }
        }

        return navbarItemModel;
    }

    private findNodesRecursively(source: object, searchPredicate: (x: object) => boolean, filterPredicate: (x: object) => boolean): ITextNode[] {
        const result = [];
    
        if (searchPredicate(source)) {
            result.push(source);
        }
    
        const keys = Object.keys(source); // This includes array keys
    
        keys.forEach(key => {
            const child = source[key];
    
            if (child instanceof Object && filterPredicate(child)) {
                const childResult = this.findNodesRecursively(child, searchPredicate, filterPredicate);
                result.push.apply(result, childResult);
            }
        });
    
        return result;
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

        const currentPageUrl = this.routeHandler.getCurrentUrl();

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

    public modelToContract(tableOfContentsModel: TableOfContentsModel): Contract {
        const tableOfContentsConfig: TableOfContentsContract = {
            object: "block",
            type: "table-of-contents",
            title: tableOfContentsModel.title,
            maxHeading: tableOfContentsModel.maxHeading,
            navigationItemKey: tableOfContentsModel.navigationItemKey
        };

        return tableOfContentsConfig;
    }
}
