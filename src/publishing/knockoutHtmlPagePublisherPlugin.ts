import * as ko from "knockout";
import { HtmlPage } from "@paperbits/common/publishing/htmlPage";
import { HtmlPagePublisherPlugin } from "@paperbits/common/publishing/htmlPagePublisherPlugin";
import { ILayoutService } from "@paperbits/common/layouts";
import { ContentViewModelBinder } from "../content/ko";
import { PopupHostViewModelBinder } from "../popup/ko/popupHostViewModelBinder";


export class KnockoutHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly layoutService: ILayoutService,
        private readonly popupHostViewModelBinder: PopupHostViewModelBinder
    ) {
        // this needed to avoid rendering issues with domino in different environments.
        ko.tasks.scheduler = (callback) => setImmediate(callback);
    }

    private renderContent(doc: Document, layoutContentViewModel: any): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const onDescendantsComplete = () => {
                    ko.cleanNode(doc.body);
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
        const layoutContentViewModel = await this.contentViewModelBinder.contractToViewModel(layoutContentContract, page.bindingContext);
        const popupHostViewModel = await this.popupHostViewModelBinder.contractToViewModel(page.bindingContext);

        layoutContentViewModel.widgets.unshift(popupHostViewModel);

        await this.renderContent(doc, layoutContentViewModel);
    }
}
