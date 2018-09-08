import * as ko from "knockout";
import PerfectScrollbar from "perfect-scrollbar";

ko.bindingHandlers["scrollable"] = {
    init: (element: HTMLElement) => {
        let scrollbar = new PerfectScrollbar(element);
        let lastHeight = element.clientHeight;
        let lastWidth = element.clientWidth;

        const checkElementSize = (): void => {
            requestAnimationFrame(() => {
                if (!scrollbar) {
                    return;
                }

                if (element.clientHeight !== lastHeight || element.clientWidth !== lastWidth) {
                    scrollbar.update();
                    lastHeight = element.clientHeight;
                    lastWidth = element.clientWidth;
                }
                setTimeout(checkElementSize, 100);
            });
        };

        checkElementSize();

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            scrollbar.destroy();
            scrollbar = null;
        });
    }
};