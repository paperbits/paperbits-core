import { IRouteHandler } from "@paperbits/common/routing";
import { IFileService } from "@paperbits/common/files/IFileService";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { LayoutModel } from "./layoutModel";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { LayoutContract } from "@paperbits/common/layouts/layoutContract";
import { Contract } from "@paperbits/common";

export class LayoutModelBinder {
    constructor(
        private readonly fileService: IFileService,
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector) {

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async getLayoutModel(url: string, readonly?: boolean): Promise<LayoutModel> {
        const layoutNode = await this.layoutService.getLayoutByRoute(url);

        return await this.nodeToModel(layoutNode, url, readonly);
    }

    public async nodeToModel(layoutContract: LayoutContract, currentUrl: string, readonly?: boolean): Promise<LayoutModel> {
        const layoutModel = new LayoutModel();
        layoutModel.title = layoutContract.title;
        layoutModel.description = layoutContract.description;
        layoutModel.uriTemplate = layoutContract.uriTemplate;

        const layoutContentNode = await this.fileService.getFileByKey(layoutContract.contentKey);

        const modelPromises = layoutContentNode.nodes.map(async (config) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
            return await modelBinder.nodeToModel(config, currentUrl, !readonly);
        });

        const widgetModels = await Promise.all<any>(modelPromises);
        layoutModel.widgets = widgetModels;

        return layoutModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(layoutModel: LayoutModel): Contract {
        let layoutConfig: Contract = {
            object: "block",
            type: "layout",
            nodes: []
        };
        layoutModel.widgets.forEach(model => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(model);
            layoutConfig.nodes.push(modelBinder.getConfig(model));
        });

        return layoutConfig;
    }

    public async setConfig(layout: LayoutContract, config: Contract): Promise<void> {
        const file = await this.fileService.getFileByKey(layout.contentKey);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }

    public async updateContent(layoutModel: LayoutModel): Promise<void> {
        let url = this.routeHandler.getCurrentUrl();
        let layout = await this.layoutService.getLayoutByRoute(url);
        let file = await this.fileService.getFileByKey(layout.contentKey);
        let config = this.getConfig(layoutModel);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }
}