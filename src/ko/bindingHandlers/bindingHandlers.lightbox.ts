import * as ko from "knockout";
import { ILightbox } from '@paperbits/common/ui/ILightbox';

export class LightboxBindingHandler {
    constructor(lightbox: ILightbox) {
        ko.bindingHandlers["lightbox"] = {
            init(element, valueAccessor) {
                var configuration = valueAccessor();
                var lightboxContentUrl = ko.unwrap(configuration.url);

                var setContentUrl = (url: string) => {
                    lightboxContentUrl = url;
                }

                var showLightbox = () => {
                    lightbox.show(lightboxContentUrl);
                };

                if (ko.isObservable(configuration.url)) {
                    configuration.url.subscribe(setContentUrl);
                }

                ko.applyBindingsToNode(element, { click: showLightbox });
            }
        };
    }
}