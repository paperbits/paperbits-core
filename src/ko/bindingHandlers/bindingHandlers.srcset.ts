import * as ko from "knockout";
import { MediaVariantModel } from "../../picture/mediaVariantModel";

ko.bindingHandlers["srcset"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const variants: MediaVariantModel[] = ko.unwrap(valueAccessor());

        if (!variants) {
            return;
        }

        const srcset = variants.map(x =>  `${x.downloadUrl} ${x.width}w`).join(", ");

        ko.applyBindingsToNode(element, { attr: { srcset: srcset } }, null);
    }
};