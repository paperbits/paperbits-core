import * as ko from "knockout";
import { HyperlinkModel } from "@paperbits/common/permalinks";

ko.bindingHandlers["hyperlink"] = {
    init(element: HTMLElement, valueAccessor: () => HyperlinkModel): void {
        const hyperlink: HyperlinkModel = valueAccessor();
        const attributesObservable = ko.observable();

        const setElementAttributes = (hyperlink: HyperlinkModel) => {
            if (!hyperlink) {
                attributesObservable({ href: "#", target: "_blank" });
                return;
            }

            switch (hyperlink.target) {
                case "_popup":
                    attributesObservable({
                        "data-toggle": "popup",
                        "data-target": `#${hyperlink.targetKey.replace("popups/", "popups")}`,
                        "href": "javascript:void(0)"
                    });
                    return;

                    break;

                case "_download":
                    attributesObservable({
                        href: hyperlink.href,
                        download: "" // Leave empty unless file name gets specified.
                    });
                    break;

                default:
                    attributesObservable({
                        href: `${hyperlink.href}${hyperlink.anchor ? "#" + hyperlink.anchor : ""}`,
                        target: hyperlink.target
                    });
            }
        };

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(setElementAttributes);
        }

        const initial = ko.unwrap(hyperlink);
        setElementAttributes(initial);

        ko.applyBindingsToNode(element, { attr: attributesObservable }, null);
    }
};