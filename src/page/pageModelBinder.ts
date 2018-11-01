import { PageModel } from "./pageModel";
import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { IPermalinkService, PermalinkContract } from "@paperbits/common/permalinks";
import { IFileService } from "@paperbits/common/files";
import { IRouteHandler } from "@paperbits/common/routing";
import { ModelBinderSelector, WidgetModel } from "@paperbits/common/widgets";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";


export class PageModelBinder implements IModelBinder {
    private pageNotFound: PermalinkContract;
  
    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly fileService: IFileService,
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

        if (!pageContract.key) {
            const url = this.routeHandler.getCurrentUrl();
            let permalink = await this.permalinkService.getPermalinkByUrl(url);

            if (!permalink) {
                permalink = await this.getPageNotFound();
            }

            const pageKey = permalink.targetKey;
            pageContract = await this.pageService.getPageByKey(pageKey);
        }

        const pageModel = new PageModel();
        pageModel.title = pageContract.title;
        pageModel.description = pageContract.description;
        pageModel.keywords = pageContract.keywords;

        const pageContentNode = await this.fileService.getFileByKey(pageContract.contentKey);
        const modelPromises = pageContentNode.nodes.map(async (config) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
            return await modelBinder.contractToModel(config);
        });

        const models = await Promise.all<any>(modelPromises);
        pageModel.widgets = models;

        return pageModel;
    }

    private async getPageNotFound(): Promise<PermalinkContract> {
        if (!this.pageNotFound) {
            this.pageNotFound = await this.permalinkService.getPermalinkByUrl("/404");
        }
        return this.pageNotFound;
    }

    public modelToContract(pageModel: PageModel): Contract {
        const pageContract: Contract = {
            object: "block",
            type: "page"
        };

        return pageContract;
    }
}
