import { PageModel } from "./pageModel";
import { IModelBinder } from "@paperbits/common/editing";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { IPermalinkService, IPermalink } from "@paperbits/common/permalinks";
import { IFileService } from "@paperbits/common/files";
import { IRouteHandler } from "@paperbits/common/routing";
import { IEventManager } from "@paperbits/common/events";
import { ModelBinderSelector, WidgetModel } from "@paperbits/common/widgets";
import { Contract } from "@paperbits/common";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";


export class PageModelBinder implements IModelBinder {
    private pageNotFound: IPermalink;

    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly fileService: IFileService,
        private readonly routeHandler: IRouteHandler,
        private readonly eventManager: IEventManager,
        private readonly modelBinderSelector: ModelBinderSelector
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
        this.updateContent = this.updateContent.bind(this);

        this.eventManager.addEventListener("onContentUpdate", this.updateContent);
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

    private async getPageNotFound(): Promise<IPermalink> {
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

    public async updateContent(pageModel): Promise<void> {
        // const url = this.routeHandler.getCurrentUrl();
        // const permalink = await this.permalinkService.getPermalinkByUrl(url);
        // const pageKey = permalink.targetKey;
        // const page = await this.pageService.getPageByKey(pageKey);
        // const file = await this.fileService.getFileByKey(page.contentKey);
        // const contentContract: Contract = {
        //     nodes: []
        // };

        // pageModel.widgets.forEach(section => {
        //     const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
        //     contentContract.nodes.push(modelBinder.modelToContract(section));
        // });

        // Object.assign(file, contentContract);

        // await this.fileService.updateFile(file);
    }
}
