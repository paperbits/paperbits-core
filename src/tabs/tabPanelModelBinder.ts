import { TabPanelContract, TabPanelItemContract } from "./tabPanelContract";
import { TabPanelItemModel, TabPanelModel } from "./tabPanelModel";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";


export class TabPanelModelBinder implements IModelBinder<TabPanelModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "tab-panel";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TabPanelModel;
    }

    constructor(private readonly containerModelBinder: CollectionModelBinder) { }

    public async contractItemToModel(contract: TabPanelItemContract, bindingContext?: Bag<any>): Promise<TabPanelItemModel> {
        const model = new TabPanelItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.label = contract.label;
        model.widgets = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);

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

    public itemModelToContract(model: TabPanelItemModel): TabPanelItemContract {
        const tabPanelContract: TabPanelItemContract = {
            type: "tabPanel-item",
            styles: model.styles,
            label: model.label,
            nodes: []
        };

        const childNodes = this.containerModelBinder.getChildContracts(model.widgets);
        tabPanelContract.nodes.push(...childNodes);

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
