import { IModelBinder } from "@paperbits/common/editing";
import { IContentItemService } from "@paperbits/common/contentItems";
import { INavigationService, NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { Router } from "@paperbits/common/routing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { Contract } from "@paperbits/common/contract";


export class NavigationModelBinder implements IModelBinder<NavigationItemModel> {
    constructor(
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly navigationService: INavigationService,
        private readonly contentItemService: IContentItemService,
        private readonly router: Router
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "navitem";
    }

    public canHandleModel(model: any): boolean {
        return model instanceof NavigationItemModel;
    }

    public async contractToModel(contract: NavigationItemContract): Promise<NavigationItemModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const model = new NavigationItemModel();
        model.label = contract.label;
        model.key = contract.key;
        model.targetKey = contract.targetKey;
        model.isActive = model.targetUrl === this.router.getPath();

        if (contract.navigationItems) {
            const tasks = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.contractToModel(child));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                model.nodes.push(child);
            });
        }
        else if (contract.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(contract.targetKey);

            if (contentItem) {
                model.targetUrl = contentItem.permalink;
            }
        }
        else {
            console.warn(`Navigation item "${model.label}" has no permalink assigned to it.`);
        }

        return model;
    }

    public modelToContract(model: NavigationItemModel): NavigationItemContract {
        const navigationItem: NavigationItemContract = {
            key: model.key,
            label: model.label,
            targetKey: model.targetKey,
            navigationItems: model.nodes.map(x => this.modelToContract(x))
        };

        return navigationItem;
    }
}