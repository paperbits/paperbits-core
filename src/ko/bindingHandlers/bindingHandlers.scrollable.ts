import { Events } from "@paperbits/common/events";
import * as ko from "knockout";
import PerfectScrollbar from "perfect-scrollbar";

ko.bindingHandlers["scrollable"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const config = ko.unwrap(valueAccessor());

        if (typeof config === "boolean" && config === false) {
            return;
        }

        const configType = typeof config;
        let scrollbar = new PerfectScrollbar(element);

        if (configType === "object" && config.onEndReach) {
            element.addEventListener("ps-y-reach-end", () => {
                config.onEndReach();
            });
        }

        const verticalScrollBar = element.querySelector(".ps__thumb-y");
        verticalScrollBar.setAttribute("role", "scrollbar");
        verticalScrollBar.setAttribute("aria-label", "Vertical scrollbar");

        const checkElementSize = (): void => {
            requestAnimationFrame(() => {
                if (!scrollbar) {
                    return;
                }

                scrollbar.update();
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

ko.bindingHandlers["scrolledIntoView"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const config: any = ko.unwrap(valueAccessor());
        let scrollTimeout;

        const checkInView = () => {
            const elementRect = element.getBoundingClientRect();
            const parentElementRect = element.parentElement.getBoundingClientRect();

            if ((elementRect.top >= parentElementRect.top && elementRect.top <= parentElementRect.bottom) ||
                (elementRect.bottom >= parentElementRect.top && elementRect.bottom <= parentElementRect.bottom)) {

                if (config.onInView) {
                    config.onInView();
                }
            }
        };

        const onParentScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkInView, 200);
        };

        element.parentElement.addEventListener(Events.Scroll, onParentScroll);

        checkInView();

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.parentElement.removeEventListener(Events.Scroll, onParentScroll);
        });
    }
};
