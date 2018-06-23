import * as ko from "knockout";

export interface ISplitterConfig {
    element: HTMLElement;

    /**
     * Possible values: "top", "bottom", "left", "right";
     */
    side: string;

    /**
     * Possible values: "inside", "outside";
     */
    where: string;
}


ko.bindingHandlers["splitter"] = {
    init(element: HTMLElement, valueAccessor: () => ISplitterConfig) {
        const config = valueAccessor();

        element["splitterConfig"] = config;

        let updatePosition = () => {
            let currentConfig = <ISplitterConfig>element["splitterConfig"];

            if (!currentConfig || !currentConfig.element) {
                return;
            }

            const parent = currentConfig.element.ownerDocument.defaultView.frameElement;
            const parentRect = parent.getBoundingClientRect();
            const rect = currentConfig.element.getBoundingClientRect();

            element.style.left = parentRect.left + rect.left + "px";
            element.style.top = parentRect.top + rect.top + "px";
            element.style.width = rect.width + "px";
            element.style.height = rect.height + "px";

            if (currentConfig.where === "outside") {
                switch (currentConfig.side) {
                    case "top":
                        element.style.borderWidth = "4px 0 0 0";
                        break;
                    case "bottom":
                        element.style.borderWidth = "0 0 4px 0";
                        break;
                    case "left":
                        element.style.borderWidth = "0 0 0 4px";
                        break;
                    case "right":
                        element.style.borderWidth = "0 4px 0 0";
                        break;
                }
            }
            else {
                element.style.borderWidth = "4px";
            }
        }
        element["splitterUpdate"] = updatePosition;

        updatePosition();

        document.addEventListener("scroll", updatePosition);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            document.removeEventListener("scroll", updatePosition);
        });
    },

    update(element: HTMLElement, valueAccessor: () => ISplitterConfig) {
        let config = valueAccessor();

        element["splitterConfig"] = ko.unwrap(config);
        element["splitterUpdate"]();
    }
};
