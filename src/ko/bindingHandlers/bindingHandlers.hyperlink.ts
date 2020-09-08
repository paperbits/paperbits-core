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

            const downloadAttribute = hyperlink.targetKey?.startsWith("uploads/")
                ? ""
                : undefined;

            attributesObservable({ href: hyperlink.href, target: hyperlink.target, download: downloadAttribute });
        };

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(setElementAttributes);
        }

        const initial = ko.unwrap(hyperlink);
        setElementAttributes(initial);

        ko.applyBindingsToNode(element, { attr: attributesObservable }, null);
    }
};