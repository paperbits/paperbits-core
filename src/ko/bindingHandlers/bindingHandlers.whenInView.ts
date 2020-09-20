import * as ko from "knockout";

ko.bindingHandlers["whenInView"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const callback = valueAccessor();

        const onIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && callback) {
                    callback();
                }
            });
        };

        const observer = new IntersectionObserver(onIntersect);
        observer.observe(element);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            observer.disconnect();
        });
    }
};