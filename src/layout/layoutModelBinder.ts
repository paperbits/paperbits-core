import { IRouteHandler } from "@paperbits/common/routing";
import { IFileService } from "@paperbits/common/files";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { LayoutModel } from "./layoutModel";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";

export class LayoutModelBinder {
    constructor(
        private readonly fileService: IFileService,
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public async getLayoutModel(): Promise<LayoutModel> {
        const url = this.routeHandler.getCurrentUrl();
        const layoutNode = await this.layoutService.getLayoutByRoute(url);

        return await this.contractToModel(layoutNode);
    }

    public async contractToModel(layoutContract: LayoutContract): Promise<LayoutModel> {
        const layoutModel = new LayoutModel();
        layoutModel.title = layoutContract.title;
        layoutModel.description = layoutContract.description;
        layoutModel.uriTemplate = layoutContract.uriTemplate;

        const layoutContentNode = await this.fileService.getFileByKey(layoutContract.contentKey);

        const modelPromises = layoutContentNode.nodes.map(async (config) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
            return await modelBinder.contractToModel(config);
        });

        const widgetModels = await Promise.all<any>(modelPromises);
        layoutModel.widgets = widgetModels;

        return layoutModel;
    }

    public modelToContract(layoutModel: LayoutModel): LayoutContract {
        const layoutConfig: LayoutContract = {
            title: layoutModel.title,
            description: layoutModel.description,
            uriTemplate: layoutModel.uriTemplate,
            object: "block",
            type: "layout",
            nodes: []
        };

        layoutModel.widgets.forEach(model => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(model);
            layoutConfig.nodes.push(modelBinder.modelToContract(model));
        });

        return layoutConfig;
    }
}