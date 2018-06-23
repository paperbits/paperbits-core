import * as ko from "knockout";
import { IHighlightConfig } from "@paperbits/common/ui/IHighlightConfig";

ko.bindingHandlers["highlight"] = {
    init(element: HTMLElement, valueAccessor: () => IHighlightConfig) {
        let config = valueAccessor();

        element["highlightConfig"] = config;

        let updatePosition = () => {
            let currentConfig = <IHighlightConfig>element["highlightConfig"];

            if (!currentConfig || !currentConfig.element) {
                return;
            }

            let parent = currentConfig.element.ownerDocument.defaultView.frameElement;
            let parentRect = parent.getBoundingClientRect();

            let rect = currentConfig.element.getBoundingClientRect();
            element.style.left = parentRect.left + rect.left + "px";
            element.style.top = parentRect.top + rect.top + "px";
            element.style.width = rect.width + "px";
            element.style.height = rect.height + "px";
            element.title = currentConfig.text || "Widget";
        }
        element["highlightUpdate"] = updatePosition;


        updatePosition();

        document.addEventListener("scroll", updatePosition);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            document.removeEventListener("scroll", updatePosition);
        });
    },

    update(element: HTMLElement, valueAccessor: () => IHighlightConfig) {
        let config = valueAccessor();

        element["highlightConfig"] = ko.unwrap(config);
        element["highlightUpdate"]();
    }
};
