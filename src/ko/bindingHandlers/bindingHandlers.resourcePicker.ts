import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks";

ko.bindingHandlers["resourcePicker"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const config = valueAccessor();
        const resourcePicker: IHyperlinkProvider = ko.unwrap(config["resourcePicker"]);
        const onSelect = ko.unwrap(config["onSelect"]);
        const hyperlink: HyperlinkModel = ko.unwrap(config["hyperlink"]);

        let onSelectCallback;
        
        const onSelectCallbackProxy = (newResource) => {
            if (onSelectCallback) {
                onSelectCallback(newResource);
            }
        }

        ko.applyBindingsToNode(element, {
            component: {
                name: resourcePicker.componentName,
                params: { onSelect: onSelectCallbackProxy },
                oncreate: (resourceSelector: IResourceSelector<any>) => {
                    if (hyperlink && resourceSelector.selectResource) {
                        resourceSelector.selectResource(hyperlink.href);
                    }

                    onSelectCallback = (newResource) => {
                        const hyperlink = resourcePicker.getHyperlinkFromResource(newResource);
                        onSelect(hyperlink);
                    }
                }
            }
        })
    }
}