import * as ko from "knockout";
import { HyperlinkModel } from "@paperbits/common/permalinks";

ko.bindingHandlers["hyperlink"] = {
    init(element: HTMLElement, valueAccessor) {
        let hyperlink: HyperlinkModel = valueAccessor();
        let attr = ko.observable();

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(newHyperlink => {
                if (newHyperlink) {
                    attr(newHyperlink);
                }
                else {
                    attr({ href: "/", target: "_blank" });
                }
            });
        }

        let initial = ko.unwrap(hyperlink);

        if (initial) {
            attr({ href: initial.href, target: initial.target });
        }
        else {
            attr({ href: "#", target: "_blank" });
        }

        ko.applyBindingsToNode(element, { attr: attr })
    }
};