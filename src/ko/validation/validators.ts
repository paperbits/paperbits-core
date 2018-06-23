
import * as ko from "knockout";
import * as validation from "knockout.validation";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";

const errorClassName = "is-invalid";

export class KnockoutValidation {
    constructor(
        private readonly permalinkService: IPermalinkService,
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
            validator: async (permalinkUri: string, permalinkKey: string, callback: (isInUse: boolean) => void) => {
                if (!permalinkUri) {
                    return;
                }

                const permalink = await this.permalinkService.getPermalinkByUrl(permalinkUri);
                const conflict = permalink && permalink.key !== permalinkKey;

                callback(!conflict);
            },
            message: "The permalink is already in use"
        }

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
            message: "The uri template is already in use"
        };

        validation.registerExtenders();
    }
}