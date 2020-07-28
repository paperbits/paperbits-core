
import * as ko from "knockout";
import * as validation from "knockout.validation";
import { ILayoutService } from "@paperbits/common/layouts/ILayoutService";
import { IPermalinkResolver, PermalinkService } from "@paperbits/common/permalinks";

const errorClassName = "is-invalid";

export class KnockoutValidation {
    constructor(
        private readonly permalinkService: PermalinkService,
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly layoutService: ILayoutService,
        private readonly reservedPermalinks: string[]
    ) {
        validation.init({
            errorElementClass: errorClassName,
            decorateInputElement: true,
            insertMessages: false
        }, true);

        ko.extenders["onlyValid"] = (target, option) => {
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

        validation.rules["validPermalink"] = {
            async: true,
            validator: async (permalink: string, targetKey: string, callback: (valid: boolean) => void) => {
                if (!permalink) {
                    return false;
                }

                const permalinkContract = await this.permalinkService.getPermalink(permalink);
                const inUseByAnoterResource = !!permalinkContract && permalinkContract.targetKey !== targetKey;

                callback(!inUseByAnoterResource);
            },
            message: "This permalink is reserved or already in use."
        };

        validation.rules["uniqueLayoutUri"] = {
            async: true,
            validator: async (permalinkTemplate, layoutKey, callback: (isInUse: boolean) => void) => {
                if (!permalinkTemplate) {
                    callback(false);
                    return;
                }

                const layout = await this.layoutService.getLayoutByPermalinkTemplate(permalinkTemplate);
                const conflict = layout && layout.key !== layoutKey;

                callback(!conflict);
            },
            message: "This permalink template is already in use."
        };

        validation.registerExtenders();
    }
}