import { AccordionItemContract } from "./accordionContract";
import { AccordionItemModel } from "./accordionModel";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";
import { IWidgetService, ModelBinderSelector } from "@paperbits/common/widgets";


export class AccordionItemModelBinder extends CollectionModelBinder implements IModelBinder<AccordionItemModel> {
    constructor(protected readonly widgetService: IWidgetService, protected modelBinderSelector: ModelBinderSelector) {
        super(widgetService, modelBinderSelector);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "accordion-item";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof AccordionItemModel;
    }

    public async contractToModel(contract: AccordionItemContract, bindingContext?: Bag<any>): Promise<AccordionItemModel> {
        const model = new AccordionItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.label = contract.label;
        model.widgets = await this.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public modelToContract(model: AccordionItemModel): AccordionItemContract {
        const contract: AccordionItemContract = {
            type: "accordion-item",
            styles: model.styles,
            label: model.label,
            nodes: []
        };

        const childNodes = this.getChildContracts(model.widgets);
        contract.nodes!.push(...childNodes);

        return contract;
    }
}
