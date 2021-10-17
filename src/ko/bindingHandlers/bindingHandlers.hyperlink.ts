import * as ko from "knockout";
import { HyperlinkModel, HyperlinkTarget } from "@paperbits/common/permalinks";
import { Attributes, DataAttributes, HyperlinkRels } from "@paperbits/common/html";


ko.bindingHandlers["hyperlink"] = {
    update(element: HTMLElement, valueAccessor: () => HyperlinkModel): void {
        const hyperlink: HyperlinkModel = valueAccessor();
        const attributesObservable = ko.observable();

        const setElementAttributes = (hyperlink: HyperlinkModel) => {
            let href = "#";
            let toggleType = null;
            let triggerEvent = null;
            let toggleTarget = null;
            let isDownloadLink = false;
            let targetWindow = null;
            let rels = null;

            if (hyperlink) {
                switch (hyperlink.target) {
                    case HyperlinkTarget.popup:
                        href = "javascript:void(0)";
                        toggleType = "popup";
                        triggerEvent = hyperlink.triggerEvent;
                        toggleTarget = `#${hyperlink.targetKey.replace("popups/", "popups")}`;
                        break;

                    case HyperlinkTarget.download:
                        href = hyperlink.href;
                        isDownloadLink = true;
                        break;

                    default:
                        toggleType = element.getAttribute("data-toggle");
                        href = `${hyperlink.href}${hyperlink.anchor ? "#" + hyperlink.anchor : ""}`;
                        targetWindow = hyperlink.target;

                        if (hyperlink.targetKey?.startsWith("urls/")) {
                            rels = [HyperlinkRels.NoOpener, HyperlinkRels.NoReferrer].join(" ");
                        }
                }
            }

            const hyperlinkObj = {
                [DataAttributes.Toggle]: toggleType,
                [DataAttributes.TriggerEvent]: triggerEvent,
                [DataAttributes.Target]: toggleTarget,
                [Attributes.Href]: href,
                [Attributes.Target]: targetWindow,
                [Attributes.Download]: isDownloadLink
                    ? "" // Leave empty unless file name gets specified.
                    : null,
                [Attributes.Rel]: rels
            };

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