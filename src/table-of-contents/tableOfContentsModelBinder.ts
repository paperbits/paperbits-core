import { Bag, Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { TableOfContentsContract } from "./tableOfContentsContract";
import { TableOfContentsModel } from "./tableOfContentsModel";

export class TableOfContentsModelBinder implements IModelBinder<TableOfContentsModel> {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly navigationService: INavigationService
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "table-of-contents";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableOfContentsModel;
    }

    private async processNavigationItem(navigationItem: NavigationItemContract, permalink: string): Promise<NavigationItemModel> {
        const navbarItemModel = new NavigationItemModel();
        navbarItemModel.label = navigationItem.label;

        if (navigationItem.targetKey) {
            const targetUrl = await this.permalinkResolver.getUrlByTargetKey(navigationItem.targetKey);
            navbarItemModel.targetUrl = targetUrl;

            if (targetUrl === permalink) {
                navbarItemModel.isActive = true;
            }
        }

        return navbarItemModel;
    }

    public async contractToModel(contract: TableOfContentsContract, bindingContext?: Bag<any>): Promise<TableOfContentsModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const tableOfContentsModel = new TableOfContentsModel();
        tableOfContentsModel.navigationItemKey = contract.navigationItemKey;
        tableOfContentsModel.minHeading = contract.minHeading || 1;
        tableOfContentsModel.maxHeading = contract.maxHeading || 1;
        tableOfContentsModel.items = [];

        if (contract.navigationItemKey) {
            const currentPageUrl = bindingContext?.navigationPath;

            const assignedNavigationItem = await this.navigationService.getNavigationItem(contract.navigationItemKey);
            tableOfContentsModel.title = tableOfContentsModel.title || assignedNavigationItem.label;

            if (assignedNavigationItem && assignedNavigationItem.navigationItems) { // has child nav items
                const promises = assignedNavigationItem.navigationItems.map(async navigationItem => {
                    return await this.processNavigationItem(navigationItem, currentPageUrl);
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
            minHeading: model.minHeading,
            maxHeading: model.maxHeading,
            navigationItemKey: model.navigationItemKey
        };

        return contract;
    }
}
