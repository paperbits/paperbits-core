import { IModelBinder } from "@paperbits/common/editing";
import { NavigationItemContract, NavigationItemModel } from "@paperbits/common/navigation";
import { Router } from "@paperbits/common/routing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { Contract } from "@paperbits/common/contract";
import { Bag } from "@paperbits/common";


export class NavigationModelBinder implements IModelBinder<NavigationItemModel> {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly router: Router
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "navitem";
    }

    public canHandleModel(model: any): boolean {
        return model instanceof NavigationItemModel;
    }

    public async contractToModel(contract: NavigationItemContract, bindingContext?: Bag<any>): Promise<NavigationItemModel> {
        if (!contract) {
            throw new Error(`Parameter "contract" not specified.`);
        }

        const model = new NavigationItemModel();
        model.label = contract.label;
        model.key = contract.key;
        model.targetKey = contract.targetKey;
        model.targetWindow = contract.targetWindow;
        model.anchor = contract.anchor;
        model.triggerEvent = contract.triggerEvent;
        model.isActive = model.targetUrl === this.router.getPath();

        if (contract.navigationItems) {
            const tasks: Promise<NavigationItemModel>[] = [];

            contract.navigationItems.forEach(child => {
                tasks.push(this.contractToModel(child));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                model.nodes.push(child);
            });
        }
        else if (contract.targetKey) {
            const targetUrl = await this.permalinkResolver.getUrlByTargetKey(contract.targetKey, bindingContext?.locale);
            model.targetUrl = targetUrl;
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
            targetWindow: model.targetWindow,
            triggerEvent: model.triggerEvent,
            anchor: model.anchor,
            navigationItems: model.nodes.map(x => this.modelToContract(x))
        };

        return navigationItem;
    }
}