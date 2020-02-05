import * as ko from "knockout";
import { HtmlPage, HtmlPagePublisherPlugin } from "@paperbits/common/publishing";
import { ContentViewModelBinder } from "../content/ko";
import { ILayoutService } from "@paperbits/common/layouts";


export class KnockoutHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly layoutService: ILayoutService
    ) { }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        ko.tasks.scheduler = (callback) => setImmediate(callback);

        return new Promise(async (resolve, reject) => {
            try {
                const layoutContract = await this.layoutService.getLayoutByPermalink(page.permalink);
                const layoutContentContract = await this.layoutService.getLayoutContent(layoutContract.key);
                const layoutContentViewModel = await this.contentViewModelBinder.getContentViewModelByKey(layoutContentContract, page.bindingContext);

                ko.applyBindingsToNode(document.body, { widget: layoutContentViewModel }, null);
                setTimeout(resolve, 500);
            }
            catch (error) {
                reject(`Unable to apply knockout bindings to a template: ${error}`);
            }
        });
    }
}
