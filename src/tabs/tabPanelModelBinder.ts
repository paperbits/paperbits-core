import { TabPanelContract, TabPanelItemContract } from "./tabPanelContract";
import { TabPanelItemModel, TabPanelModel } from "./tabPanelModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";


export class TabPanelModelBinder implements IModelBinder<TabPanelModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "tab-panel";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TabPanelModel;
    }

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector
    ) { }

    public async contractItemToModel(contract: TabPanelItemContract, bindingContext?: Bag<any>): Promise<TabPanelItemModel> {
        const model = new TabPanelItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.label = contract.label;

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public async contractToModel(contract: TabPanelContract, bindingContext?: Bag<any>): Promise<TabPanelModel> {
        const model = new TabPanelModel();

        contract.tabPanelItems = contract.tabPanelItems || [];
        model.styles = contract.styles || {};

        const modelPromises = contract.tabPanelItems.map(async (contract: TabPanelItemContract) => {
            return await this.contractItemToModel(contract, bindingContext);
        });

        model.tabPanelItems = await Promise.all<any>(modelPromises);

        return model;
    }

    public itemModelToContract(tabPanelItemModel: TabPanelItemModel): TabPanelItemContract {
        const tabPanelContract: TabPanelItemContract = {
            type: "tabPanel-item",
            styles: tabPanelItemModel.styles,
            label: tabPanelItemModel.label,
            nodes: []
        };

        tabPanelItemModel.widgets.forEach(tabPanelItemModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(tabPanelItemModel);
            tabPanelContract.nodes.push(modelBinder.modelToContract(tabPanelItemModel));
        });

        return tabPanelContract;
    }

    public modelToContract(tabPanelModel: TabPanelModel): TabPanelContract {
        const tabPanelContract: TabPanelContract = {
            type: "tab-panel",
            styles: tabPanelModel.styles,
            tabPanelItems: []
        };

        tabPanelModel.tabPanelItems.forEach(tabPanelItemModel => {
            tabPanelContract.tabPanelItems.push(this.itemModelToContract(tabPanelItemModel));
        });

        return tabPanelContract;
    }
}
