import { SectionContract } from "./sectionContract";
import { SectionModel } from "./sectionModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract } from "@paperbits/common";

export class SectionModelBinder implements IModelBinder {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: SectionContract): Promise<SectionModel> {
        const model = new SectionModel();

        contract.nodes = contract.nodes || [];
        model.container = contract.layout;
        model.padding = contract.padding;
        model.styles = contract.styles;

        const modelPromises = contract.nodes.map(async (contract: Contract) => {
            const modelBinder: IModelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return await modelBinder.contractToModel(contract);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(sectionModel: SectionModel): SectionContract {
        const sectionContract: SectionContract = {
            type: "layout-section",
            nodes: [],
            layout: sectionModel.container,
            padding: sectionModel.padding,
            styles: sectionModel.styles
        };

        sectionModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            sectionContract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return sectionContract;
    }
}
