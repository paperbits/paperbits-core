import * as ko from "knockout";
import { HtmlPage } from "@paperbits/common/publishing/htmlPage";
import { HtmlPagePublisherPlugin } from "@paperbits/common/publishing/htmlPagePublisherPlugin";
import { ContentViewModelBinder } from "../content/ko";
import { ILayoutService } from "@paperbits/common/layouts";


export class KnockoutHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly layoutService: ILayoutService
    ) {
        ko.tasks.scheduler = (callback) => setImmediate(callback);
    }

    private render(doc: Document, layoutContentViewModel: any): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const onDescendantsComplete = () => {
                    resolve();
                };

                ko.applyBindingsToNode(doc.body, {
                    widget: layoutContentViewModel,
                    descendantsComplete: onDescendantsComplete,
                }, null);
            }
            catch (error) {
                reject(`Unable to apply knockout bindings to a template: ${error.stack || error.message}`);
            }
        });
    }

    public async apply(doc: Document, page: HtmlPage): Promise<void> {
        const layoutContract = await this.layoutService.getLayoutByPermalink(page.permalink, page.bindingContext?.locale);

        if (!layoutContract) {
            throw new Error(`No matching layouts found for page with permalink "${page.permalink}".`);
        }

        const layoutContentContract = await this.layoutService.getLayoutContent(layoutContract.key, page.bindingContext?.locale);
        const layoutContentViewModel = await this.contentViewModelBinder.getContentViewModelByKey(layoutContentContract, page.bindingContext);

        await this.render(doc, layoutContentViewModel);
        setTimeout(() => ko.cleanNode(doc.body), 400);
    }
}
