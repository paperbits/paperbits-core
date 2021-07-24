import * as ko from "knockout";
import { MediaVariantModel } from "../../picture/mediaVariantModel";

ko.bindingHandlers["srcset"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const variants: MediaVariantModel[] = ko.unwrap(valueAccessor());

        if (!variants) {
            return;
        }

        // <img src="result.jpg" srcset="result@2262x1501.webp 2262w, result@1200x796.webp 1200w, result@992x658.webp 992w, result@768x510.webp 768w, result@576x382.webp 576w">

        const srcset = variants.map(x => {
            return `${x.downloadUrl} ${x.width}w`;
        });

        ko.applyBindingsToNode(element, { attr: { srcset: srcset } }, null);
    }
};