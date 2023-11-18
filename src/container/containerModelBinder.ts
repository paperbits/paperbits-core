import * as Utils from "@paperbits/common/utils";
import { ContainerModel } from "./containerModel";
import { ContainerContract } from "./containerContract";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";

export class ContainerModelBinder extends CollectionModelBinder implements IModelBinder<ContainerModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    public async contractToModel(contract: ContainerContract, bindingContext?: Bag<any>): Promise<ContainerModel> {
        const model = new ContainerModel();

        if (contract.alignment) {
            contract.alignment = Utils.optimizeBreakpoints(contract.alignment);
            model.alignment = contract.alignment;
        }

        model.overflowX = contract.overflowX;
        model.overflowY = contract.overflowY;
        model.styles = contract.styles;
        model.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: ContainerModel): Contract {
        const contract: ContainerContract = {
            type: "container",
            styles: model.styles,
            nodes: this.getChildContracts(model.widgets),
            alignment: model.alignment,
            overflowX: model.overflowX,
            overflowY: model.overflowY
        };

        return contract;
    }
}
