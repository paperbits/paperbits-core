import { AccordionContract, AccordionItemContract } from "./accordionContract";
import { AccordionItemModel, AccordionModel } from "./accordionModel";
import { CollectionModelBinder, IModelBinder } from "@paperbits/common/editing";
import { Contract, Bag } from "@paperbits/common";


export class AccordionModelBinder implements IModelBinder<AccordionModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "accordion";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof AccordionModel;
    }

    constructor(private readonly containerModelBinder: CollectionModelBinder) { }

    public async contractItemToModel(contract: AccordionItemContract, bindingContext?: Bag<any>): Promise<AccordionItemModel> {
        const model = new AccordionItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.label = contract.label;
        model.widgets = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public async contractToModel(contract: AccordionContract, bindingContext?: Bag<any>): Promise<AccordionModel> {
        const model = new AccordionModel();

        contract.accordionItems = contract.accordionItems || [];
        model.styles = contract.styles || {};

        const modelPromises = contract.accordionItems.map(async (contract: AccordionItemContract) => {
            return await this.contractItemToModel(contract, bindingContext);
        });

        model.accordionItems = await Promise.all<any>(modelPromises);

        return model;
    }

    public itemModelToContract(model: AccordionItemModel): AccordionItemContract {
        const accordionContract: AccordionItemContract = {
            type: "accordion-item",
            styles: model.styles,
            label: model.label,
            nodes: []
        };

        const childNodes = this.containerModelBinder.getChildContracts(model.widgets);
        accordionContract.nodes!.push(...childNodes);

        return accordionContract;
    }

    public modelToContract(accordionModel: AccordionModel): AccordionContract {
        const accordionContract: AccordionContract = {
            type: "accordion",
            styles: accordionModel.styles,
            accordionItems: []
        };

        accordionModel.accordionItems.forEach(accordionItemModel => {
            accordionContract.accordionItems.push(this.itemModelToContract(accordionItemModel));
        });

        return accordionContract;
    }
}
