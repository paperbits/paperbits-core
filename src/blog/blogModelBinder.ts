import { IModelBinder } from "@paperbits/common/editing";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IRouteHandler } from "@paperbits/common/routing";
import { BlogPostModel } from "./blogPostModel";
import { BlogPostContract } from "@paperbits/common/blogs/BlogPostContract";
import { Contract } from "@paperbits/common";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class BlogModelBinder implements IModelBinder {
    constructor(
        private readonly blogService: IBlogService,
        private readonly permalinkService: IPermalinkService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly routeHandler: IRouteHandler
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "blog";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof BlogPostModel;
    }

    public async contractToModel(blogPostContract: BlogPostContract): Promise<BlogPostModel> {
        if (!blogPostContract.key) {
            const currentUrl = this.routeHandler.getCurrentUrl();
            const permalink = await this.permalinkService.getPermalinkByUrl(currentUrl);
            const blogKey = permalink.targetKey;

            blogPostContract = await this.blogService.getBlogPostByKey(blogKey);
        }

        const blogPostModel = new BlogPostModel();
        blogPostModel.title = blogPostContract.title;
        blogPostModel.description = blogPostContract.description;
        blogPostModel.keywords = blogPostContract.keywords;

        const blogPostContent = await this.blogService.getBlogPostContent(blogPostContract.key);
        const modelPromises = blogPostContent.nodes.map(async (config) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
            return await modelBinder.contractToModel(config);
        });
        const models = await Promise.all<any>(modelPromises);
        blogPostModel.widgets = models;

        return blogPostModel;
    }

    public modelToContract(blogModel: BlogPostModel): Contract {
        const blogConfig: Contract = {
            object: "block",
            type: "blog",
            nodes: []
        };
        blogModel.widgets.forEach(section => {
            const modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
            blogConfig.nodes.push(modelBinder.modelToContract(section));
        });

        return blogConfig;
    }

    public async updateContent(blogModel: BlogPostModel): Promise<void> {
        const url = this.routeHandler.getCurrentUrl();
        const permalink = await this.permalinkService.getPermalinkByUrl(url);
        const blogKey = permalink.targetKey;
        const content = await this.blogService.getBlogPostContent(blogKey);
        const config = this.modelToContract(blogModel);

        Object.assign(content, config);

        await this.blogService.updateBlogPostContent(blogKey, content);
    }
}
