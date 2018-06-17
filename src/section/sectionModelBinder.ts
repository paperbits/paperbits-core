import { SectionConfig } from "./sectionContract";
import { RowModel } from "../row/rowModel";
import { SectionModel } from "./sectionModel";
import { RowModelBinder } from "../row/rowModelBinder";
import { IModelBinder } from "@paperbits/common/editing";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { Contract } from "@paperbits/common";

export class SectionModelBinder implements IModelBinder {
    private readonly rowModelBinder: RowModelBinder;
    private readonly backgroundModelBinder: BackgroundModelBinder;

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(rowModelBinder: RowModelBinder, backgroundModelBinder: BackgroundModelBinder) {
        this.rowModelBinder = rowModelBinder;
        this.backgroundModelBinder = backgroundModelBinder;

        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async nodeToModel(sectionContract: SectionConfig): Promise<SectionModel> {
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
            sectionModel.background = await this.backgroundModelBinder.nodeToModel(sectionContract.background);
        }

        const rowModelPromises = sectionContract.nodes.map(this.rowModelBinder.nodeToModel);
        sectionModel.rows = await Promise.all<RowModel>(rowModelPromises);

        return sectionModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(sectionModel: SectionModel): Contract {
        const sectionConfig: SectionConfig = {
            type: "layout-section",
            object: "block",
            nodes: [],
            layout: sectionModel.container,
            padding: sectionModel.padding,
            snapping: sectionModel.snap
        };

        if (sectionModel.background) {
            sectionConfig.background = {
                color: sectionModel.background.colorKey,
                size: sectionModel.background.size,
                position: sectionModel.background.position
            }

            if (sectionModel.background.sourceType === "picture") {
                sectionConfig.background.picture = {
                    sourcePermalinkKey: sectionModel.background.sourceKey,
                    repeat: sectionModel.background.repeat
                }
            }
        }

        sectionModel.rows.forEach(row => {
            sectionConfig.nodes.push(this.rowModelBinder.getRowConfig(row));
        });

        return sectionConfig;
    }
}
