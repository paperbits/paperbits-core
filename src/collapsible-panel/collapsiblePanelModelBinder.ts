import { IModelBinder } from "@paperbits/common/editing";
import { CollapsiblePanelModel } from "./collapsiblePanelModel";
import { Contract, Bag } from "@paperbits/common";
import { CollapsiblePanelContract } from "./collapsiblePanelContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";


export class CollapsiblePanelModelBinder implements IModelBinder<CollapsiblePanelModel>  {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) {    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "collapsible-panel";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CollapsiblePanelModel;
    }

    public async contractToModel(contract: CollapsiblePanelContract, bindingContext?: Bag<any>): Promise<CollapsiblePanelModel> {
        const model = new CollapsiblePanelModel();

        if (contract.styles) {
            model.styles = contract.styles;
        }

        if (!contract.nodes) {
            contract.nodes = [];
        }

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: CollapsiblePanelModel): Contract {
        const contract: CollapsiblePanelContract = {
            type: "collapsible-panel",
            styles: model.styles,
            version: model.version,
            nodes: []
        };

        model.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            contract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return contract;
    }
}
