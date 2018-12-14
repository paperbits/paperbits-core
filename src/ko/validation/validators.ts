
import * as ko from "knockout";
import * as validation from "knockout.validation";
import { IContentItemService } from "@paperbits/common/contentItems";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";

const errorClassName = "is-invalid";

export class KnockoutValidation {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly layoutService: ILayoutService
    ) {
        validation.init({
            errorElementClass: errorClassName,
            decorateInputElement: true,
            insertMessages: false
        }, true);

        ko.extenders["onlyValid"] = function (target, option) {
            const resultObservable: any = ko.observable(target());

            target.subscribe((newValue) => {
                if (target.isValidating && target.isValidating()) {
                    const subscription = target.isValidating.subscribe(v => {
                        subscription.dispose();

                        if (target.isValid()) {
                            resultObservable(newValue);
                        }
                    });
                }
                else {
                    if (target.isValid()) {
                        resultObservable(newValue);
                    }
                }
            });

            return resultObservable;
        };

        validation.rules["uniquePermalink"] = {
            async: true,
            validator: async (permalinkUri: string, contentItemKey: string, callback: (isInUse: boolean) => void) => {
                if (!permalinkUri) {
                    return;
                }

                const page = await this.contentItemService.getContentItemByUrl(permalinkUri);
                const conflict = page && page.key !== contentItemKey;

                callback(!conflict);
            },
            message: "This permalink is already in use."
        };

        validation.rules["uniqueLayoutUri"] = {
            async: true,
            validator: async (uriTemplate, layoutKey, callback) => {
                if (!uriTemplate) {
                    return;
                }

                const layout = await this.layoutService.getLayoutByUriTemplate(uriTemplate);
                const conflict = layout && layout.key !== layoutKey;

                callback(!conflict);
            },
            message: "This URI template is already in use."
        };

        validation.registerExtenders();
    }
}