import { IModelBinder } from "@paperbits/common/editing";
import { IBlogService, BlogPostContract  } from "@paperbits/common/blogs";
import { RouteHandler } from "@paperbits/common/routing";
import { BlogPostModel } from "./blogPostModel";
import { Contract, Bag } from "@paperbits/common";
import { ModelBinderSelector } from "@paperbits/common/widgets";

export class BlogModelBinder implements IModelBinder<BlogPostModel> {
    constructor(
        private readonly blogService: IBlogService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly routeHandler: RouteHandler
    ) {
        // rebinding...
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "blog";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof BlogPostModel;
    }

    public async contractToModel(blogPostContract: BlogPostContract, bindingContext?: Bag<any>): Promise<BlogPostModel> {
        if (!blogPostContract.key) {
            const currentUrl = this.routeHandler.getPath();
            blogPostContract = await this.blogService.getBlogPostByPermalink(currentUrl);
        }

        const blogPostModel = new BlogPostModel();
        blogPostModel.title = blogPostContract.title;
        blogPostModel.description = blogPostContract.description;
        blogPostModel.keywords = blogPostContract.keywords;

        const blogPostContent = await this.blogService.getBlogPostContent(blogPostContract.key);
        const modelPromises = blogPostContent.nodes.map(async (contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });
        const models = await Promise.all<any>(modelPromises);
        blogPostModel.widgets = models;

        return blogPostModel;
    }

    public modelToContract(blogModel: BlogPostModel): Contract {
        const blogConfig: Contract = {
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
        const url = this.routeHandler.getPath();
        const post = await this.blogService.getBlogPostByPermalink(url);
        const content = await this.blogService.getBlogPostContent(post.key);
        const config = this.modelToContract(blogModel);

        Object.assign(content, config);

        await this.blogService.updateBlogPostContent(post.key, content);
    }
}
