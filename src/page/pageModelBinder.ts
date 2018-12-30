import { PageModel } from "./pageModel";
import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { ModelBinderSelector, WidgetModel } from "@paperbits/common/widgets";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";


export class PageModelBinder implements IModelBinder {
    constructor(
        private readonly pageService: IPageService,
        private readonly routeHandler: IRouteHandler,
        private readonly modelBinderSelector: ModelBinderSelector
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "page";
    }

    public canHandleModel(model: WidgetModel): boolean {
        return model instanceof PageModel;
    }

    public async contractToModel(pageContract: PageContract): Promise<any> {
        const metadata = this.routeHandler.getCurrentUrlMetadata();

        if (metadata && metadata["usePagePlaceholder"]) {
            const pageModel = new PageModel();
            pageModel.title = pageContract.title;
            pageModel.description = pageContract.description;
            pageModel.keywords = pageContract.keywords;
            pageModel.widgets = [<any>new PlaceholderModel(pageContract, "Content")];

            return pageModel;
        }

        const currentUrl = this.routeHandler.getCurrentUrl();
        pageContract = await this.pageService.getPageByPermalink(currentUrl);

        if (!pageContract) {
            pageContract = await this.pageService.getPageByPermalink("/404");
        }

        if (pageContract) {
            const pageModel = new PageModel();
            pageModel.title = pageContract.title;
            pageModel.description = pageContract.description;
            pageModel.keywords = pageContract.keywords;
    
            const pageContent = await this.pageService.getPageContent(pageContract.key);
    
            const modelPromises = pageContent.nodes.map(async (config) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
                return await modelBinder.contractToModel(config);
            });
    
            const models = await Promise.all<WidgetModel>(modelPromises);
            pageModel.widgets = models;
    
            return pageModel;
        }

        const pageModel = new PageModel();
        pageModel.title = "";
        pageModel.description = "";
        pageModel.keywords = "";
        pageModel.widgets = [<any>new PlaceholderModel(pageContract, "No pages")];

        return pageModel;
    }

    public modelToContract(pageModel: PageModel): Contract {
        const pageContract: Contract = {
            object: "block",
            type: "page"
        };

        return pageContract;
    }
}
