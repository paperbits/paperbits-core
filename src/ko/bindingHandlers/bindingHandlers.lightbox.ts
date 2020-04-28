import * as ko from "knockout";
import { ILightbox } from "@paperbits/common/ui/ILightbox";

export class LightboxBindingHandler {
    constructor(lightbox: ILightbox) {
        ko.bindingHandlers["lightbox"] = {
            init(element, valueAccessor) {
                const configuration = valueAccessor();
                let lightboxContentUrl = ko.unwrap(configuration.url);
                let lightBoxContendFileName = ko.unwrap(configuration.fileName);

                const setContentUrl = (url: string) => {
                    lightboxContentUrl = url;
                };

                const showLightbox = () => {
                    lightbox.show(lightboxContentUrl, lightBoxContendFileName);
                };

                if (ko.isObservable(configuration.url)) {
                    configuration.url.subscribe(setContentUrl);
                }

                ko.applyBindingsToNode(element, { click: showLightbox }, null);
            }
        };
    }
}