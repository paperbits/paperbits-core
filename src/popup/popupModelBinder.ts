import { PopupInstanceModel } from "./popupModel";
import { PopupInstanceContract } from "./popupContract";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";
import { PopupContract, PopupService } from "@paperbits/common/popups";

export class PopupModelBinder implements IModelBinder<PopupInstanceModel> {
    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly popupService: PopupService
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "popup";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PopupInstanceModel;
    }

    public async contractToModel(contract: PopupContract, bindingContext?: Bag<any>): Promise<PopupInstanceModel> {
        const popupContent: PopupInstanceContract = <any>await this.popupService.getPopupContent(contract.key, bindingContext?.locale);

        const model = new PopupInstanceModel();
        model.key = contract.key;
        model.styles = popupContent.styles;
        model.backdrop = popupContent.backdrop;

        const modelPromises = popupContent.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return modelBinder.contractToModel(contract, bindingContext);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(model: PopupInstanceModel): PopupInstanceContract {
        const contract: PopupInstanceContract = {
            type: "popup",
            styles: model.styles,
            backdrop: model.backdrop,
            nodes: model.widgets.map(widget => {
                const modelBinder = this.modelBinderSelector.getModelBinderByModel(widget);
                return modelBinder.modelToContract(widget);
            })
        };

        return contract;
    }
}
