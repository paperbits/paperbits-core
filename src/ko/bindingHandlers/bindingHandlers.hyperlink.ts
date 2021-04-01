import * as ko from "knockout";
import { HyperlinkModel, HyperlinkTarget } from "@paperbits/common/permalinks";

ko.bindingHandlers["hyperlink"] = {
    init(element: HTMLElement, valueAccessor: () => HyperlinkModel): void {
        const hyperlink: HyperlinkModel = valueAccessor();
        const attributesObservable = ko.observable();

        const setElementAttributes = (hyperlink: HyperlinkModel) => {
            if (!hyperlink) {
                attributesObservable({ href: "#", target: "_blank" });
                return;
            }

            let hyperlinkObj;

            switch (hyperlink.target) {
                case HyperlinkTarget.popup:
                    hyperlinkObj = {
                        "data-toggle": "popup",
                        "data-target": `#${hyperlink.targetKey.replace("popups/", "popups")}`,
                        "href": "javascript:void(0)"
                    };
                    break;

                case HyperlinkTarget.download:
                    hyperlinkObj = {
                        href: hyperlink.href,
                        download: "" // Leave empty unless file name gets specified.
                    };
                    break;

                default:
                    hyperlinkObj = {
                        href: `${hyperlink.href}${hyperlink.anchor ? "#" + hyperlink.anchor : ""}`,
                        target: hyperlink.target
                    };
            }
            attributesObservable(hyperlinkObj);
        };

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(setElementAttributes);
        }

        const initial = ko.unwrap(hyperlink);
        setElementAttributes(initial);

        ko.applyBindingsToNode(element, { attr: attributesObservable }, null);
    }
};