import * as ko from "knockout";
import { HtmlPage, HtmlPagePublisherPlugin } from "@paperbits/common/publishing";
import { LayoutViewModelBinder } from "../layout/ko";


export class KnockoutHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(private readonly layoutViewModelBinder: LayoutViewModelBinder) { }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const layoutViewModel = await this.layoutViewModelBinder.getLayoutViewModel(page.permalink, null);
                ko.applyBindingsToNode(document.body, { widget: layoutViewModel }, null);
                setTimeout(resolve, 500);
            }
            catch (error) {
                reject(`Unable to apply knockout bindings to a template: ${error}`);
            }
        });
    }
}
