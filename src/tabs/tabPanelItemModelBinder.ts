import { TabPanelItemContract } from "./tabPanelContract";
import { TabPanelItemModel } from "./tabPanelModel";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";


export class TabPanelItemModelBinder extends CollectionModelBinder implements IModelBinder<TabPanelItemModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "tabPanel-item";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TabPanelItemModel;
    }

    public async contractToModel(contract: TabPanelItemContract, bindingContext?: Bag<any>): Promise<TabPanelItemModel> {
        const model = new TabPanelItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.label = contract.label;
        model.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: TabPanelItemModel): TabPanelItemContract {
        const contract: TabPanelItemContract = {
            type: "tabPanel-item",
            styles: model.styles,
            label: model.label,
            nodes: []
        };

        const childNodes = this.getChildContracts(model.widgets);
        contract.nodes.push(...childNodes);

        return contract;
    }
}
