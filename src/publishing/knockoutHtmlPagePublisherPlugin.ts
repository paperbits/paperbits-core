import * as ko from "knockout";
import { HtmlPage } from "@paperbits/common/publishing/htmlPage";
import { HtmlPagePublisherPlugin } from "@paperbits/common/publishing/htmlPagePublisherPlugin";
import { ContentViewModelBinder } from "../content/ko";
import { ILayoutService } from "@paperbits/common/layouts";
import { PopupHostViewModelBinder } from "../popup/ko/popupHostViewModelBinder";


export class KnockoutHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly layoutService: ILayoutService,
        private readonly popupHostViewModelBinder: PopupHostViewModelBinder
    ) {
        ko.tasks.scheduler = (callback) => setImmediate(callback);
    }

    private render(doc: Document, layoutContentViewModel: any): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const onDescendantsComplete = () => {
                    setTimeout(() => {
                        ko.cleanNode(doc.body);
                        resolve();
                    }, 400);
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
        const layoutContentViewModel = await this.contentViewModelBinder.contractToViewModel(layoutContentContract, page.bindingContext);
        const popupHostViewModel = await this.popupHostViewModelBinder.contractToViewModel(page.bindingContext);

         layoutContentViewModel.widgets.unshift(popupHostViewModel);

        await this.render(doc, layoutContentViewModel);
    }
}
