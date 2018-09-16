import * as ko from "knockout";

export interface StickToConfig {
    target: HTMLElement;

    /**
     * top, bottom, left, right, center
     */
    position: string;

    /**
     * border (default), corner
     */
    placement: string;
}

ko.bindingHandlers["stickTo"] = {
    init(element: HTMLElement, valueAccessor: () => StickToConfig) {
        const config = valueAccessor();

        const updatePosition = () => {
            if (!config.target) {
                return;
            }

            const parent = config.target.ownerDocument.defaultView.frameElement;
            const parentRect = parent.getBoundingClientRect();
            const rect = config.target.getBoundingClientRect();
            const placement = config.placement || "border";
            let coordX: number;
            let coordY: number;

            element.style.right = null;
            element.style.left = null;

            coordX = rect.left + Math.floor((rect.width) / 2) - Math.floor(element.clientWidth / 2);
            coordY = rect.top + Math.floor((rect.height) / 2) - Math.floor(element.clientHeight / 2);

            if (config.position.indexOf("top") >= 0) {
                coordY = rect.top;

                if (placement === "border") {
                    coordY = coordY - Math.floor(element.clientHeight / 2);
                }
            }

            if (config.position.indexOf("bottom") >= 0) {
                coordY = rect.top + rect.height - element.clientHeight;

                if (placement === "border") {
                    coordY = coordY + Math.floor(element.clientHeight / 2);
                }
            }

            if (config.position.indexOf("left") >= 0) {
                element.style.left = parentRect.left + rect.left + 10 + "px";
            }
            else if (config.position.indexOf("right") >= 0) {
                element.style.right = parentRect.right - rect.right + 10 + "px";
            }
            else {
                element.style.left = parentRect.left + coordX + "px";
            }

            element.style.top = parentRect.top + coordY + "px";
        };

        updatePosition();

        const onScroll = async (event: MouseEvent): Promise<void> => {
            requestAnimationFrame(updatePosition);
        };

        window.addEventListener("scroll", onScroll, true);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            window.removeEventListener("scroll", onScroll, true);
        });
    }
};
