import { IRouteHandler } from "@paperbits/common/routing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { LayoutModel } from "./layoutModel";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { Contract } from "@paperbits/common";

export class LayoutModelBinder {
    constructor(
        private readonly layoutService: ILayoutService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout";
    }

    public canHandleModel(model): boolean {
        return model instanceof LayoutModel;
    }

    public async getLayoutModel(): Promise<LayoutModel> {
        const url = this.routeHandler.getPath();
        const layoutNode = await this.layoutService.getLayoutByRoute(url);

        return await this.contractToModel(layoutNode);
    }

    public async contractToModel(contract: LayoutContract): Promise<LayoutModel> {
        const layoutModel = new LayoutModel();
        layoutModel.title = contract.title;
        layoutModel.description = contract.description;
        layoutModel.permalinkTemplate = contract.permalinkTemplate;

        const layoutContent = await this.layoutService.getLayoutContent(contract.key);

        const modelPromises = layoutContent.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return await modelBinder.contractToModel(contract);
        });

        const widgetModels = await Promise.all<any>(modelPromises);
        layoutModel.widgets = widgetModels;

        return layoutModel;
    }

    public modelToContract(model: LayoutModel): LayoutContract {
        const contract: LayoutContract = {
            title: model.title,
            description: model.description,
            permalinkTemplate: model.permalinkTemplate,
            type: "layout",
            nodes: []
        };

        model.widgets.forEach(model => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(model);
            contract.nodes.push(modelBinder.modelToContract(model));
        });

        return contract;
    }
}