import { SectionContract } from "./sectionContract";
import { SectionModel } from "./sectionModel";
import { IModelBinder } from "@paperbits/common/editing";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class SectionModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly backgroundModelBinder: BackgroundModelBinder) {

        this.contractToModel = this.contractToModel.bind(this);
    }

    public async contractToModel(sectionContract: SectionContract): Promise<SectionModel> {
        const sectionModel = new SectionModel();

        if (!sectionContract.nodes) {
            sectionContract.nodes = [];
        }

        if (sectionContract.layout) {
            sectionModel.container = sectionContract.layout;
        }

        if (sectionContract.padding) {
            sectionModel.padding = sectionContract.padding;
        }

        if (sectionContract.snapping) {
            sectionModel.snap = sectionContract.snapping;
        }

        if (sectionContract.background) {
            sectionModel.background = await this.backgroundModelBinder.contractToModel(sectionContract.background);
        }

        const modelPromises = sectionContract.nodes.map(async (node) => {
            let modelBinder: IModelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return await modelBinder.contractToModel(node);
        });

        sectionModel.widgets = await Promise.all<any>(modelPromises);

        return sectionModel;
    }

    public modelToContract(sectionModel: SectionModel): SectionContract {
        const sectionContract: SectionContract = {
            type: "layout-section",
            object: "block",
            nodes: [],
            layout: sectionModel.container,
            padding: sectionModel.padding,
            snapping: sectionModel.snap
        };

        if (sectionModel.background) {
            sectionContract.background = {
                color: sectionModel.background.colorKey,
                size: sectionModel.background.size,
                position: sectionModel.background.position
            }

            if (sectionModel.background.sourceType === "picture") {
                sectionContract.background.picture = {
                    sourcePermalinkKey: sectionModel.background.sourceKey,
                    repeat: sectionModel.background.repeat
                }
            }
        }

        sectionModel.widgets.forEach(widgetModel => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            sectionContract.nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return sectionContract;
    }
}
