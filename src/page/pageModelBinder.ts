import { PageModel } from "./pageModel";
import { Contract, Bag } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { IRouteHandler } from "@paperbits/common/routing";
import { ModelBinderSelector, WidgetModel } from "@paperbits/common/widgets";
import { PlaceholderModel } from "@paperbits/common/widgets/placeholder";


export class PageModelBinder implements IModelBinder {
    constructor(
        private readonly pageService: IPageService,
        private readonly modelBinderSelector: ModelBinderSelector
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "page";
    }

    public canHandleModel(model: WidgetModel): boolean {
        return model instanceof PageModel;
    }

    public async contractToModel(pageContract: PageContract, bindingContext?: Bag<any>): Promise<any> {
        if (bindingContext && bindingContext["routeKind"] === "layout") {
            const pageModel = new PageModel();
            pageModel.title = pageContract.title;
            pageModel.description = pageContract.description;
            pageModel.keywords = pageContract.keywords;
            pageModel.widgets = [<any>new PlaceholderModel("Content")];

            return pageModel;
        }

        pageContract = await this.pageService.getPageByPermalink(bindingContext.navigationPath);

        if (!pageContract) {
            pageContract = await this.pageService.getPageByPermalink("/404");
        }

        if (pageContract) {
            const pageModel = new PageModel();
            pageModel.title = pageContract.title;
            pageModel.description = pageContract.description;
            pageModel.keywords = pageContract.keywords;

            const pageContent = await this.pageService.getPageContent(pageContract.key);

            if (pageContent && pageContent.nodes) {
                const modelPromises = pageContent.nodes.map(async (contract: Contract) => {
                    const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
                    return await modelBinder.contractToModel(contract, bindingContext);
                });

                const models = await Promise.all<WidgetModel>(modelPromises);
                pageModel.widgets = models;
            }
            else {
                console.warn(`Page content with key ${pageContract.contentKey} not found.`);
            }

            return pageModel;
        }

        const pageModel = new PageModel();
        pageModel.title = "";
        pageModel.description = "";
        pageModel.keywords = "";
        pageModel.widgets = [<any>new PlaceholderModel("No pages")];

        return pageModel;
    }

    public modelToContract(pageModel: PageModel): Contract {
        const pageContract: Contract = {
            type: "page"
        };

        return pageContract;
    }
}
