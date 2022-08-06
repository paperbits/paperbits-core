import { Bag, Contract } from "@paperbits/common";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { PopupContract, PopupService } from "@paperbits/common/popups";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";
import { PopupInstanceContract } from "./popupContract";
import { PopupInstanceModel } from "./popupModel";

export class PopupModelBinder extends ContainerModelBinder implements IModelBinder<PopupInstanceModel> {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected readonly modelBinderSelector: ModelBinderSelector,
        private readonly popupService: PopupService
    ) {
        super(widgetService, modelBinderSelector);
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
        model.widgets = await this.getChildModels(popupContent.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: PopupInstanceModel): PopupInstanceContract {
        const contract: PopupInstanceContract = {
            type: "popup",
            styles: model.styles,
            backdrop: model.backdrop,
            nodes: this.getChildContracts(model.widgets)
        };

        return contract;
    }
}
