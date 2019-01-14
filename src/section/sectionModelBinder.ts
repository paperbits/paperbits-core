import { SectionContract } from "./sectionContract";
import { SectionModel } from "./sectionModel";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class SectionModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector) {

        this.contractToModel = this.contractToModel.bind(this);
    }

    public async contractToModel(contract: SectionContract): Promise<SectionModel> {
        const model = new SectionModel();

        contract.nodes = contract.nodes || [];
        model.container = contract.layout;
        model.padding = contract.padding;
        model.snap = contract.snapping;
        model.height = contract.height;
        model.styles = contract.styles;

        const modelPromises = contract.nodes.map(async (node) => {
            const modelBinder: IModelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return await modelBinder.contractToModel(node);
        });

        model.widgets = await Promise.all<any>(modelPromises);

        return model;
    }

    public modelToContract(sectionModel: SectionModel): SectionContract {
        const sectionContract: SectionContract = {
            type: "layout-section",
            object: "block",
            nodes: [],
            layout: sectionModel.container,
            padding: sectionModel.padding,
            snapping: sectionModel.snap,
            height: sectionModel.height,
            styles: sectionModel.styles
        };

        sectionModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            sectionContract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return sectionContract;
    }
}
