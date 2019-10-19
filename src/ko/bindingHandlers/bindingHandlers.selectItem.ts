import * as ko from "knockout";

ko.bindingHandlers["selectItem"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const isSelected = valueAccessor();

        if (ko.isObservable(isSelected)) {
            isSelected.subscribe((selected: boolean) => {
                if (selected) {
                    const rect = element.getBoundingClientRect();
                    const html = document.documentElement;
                    const isInView = (rect 
                        && rect.bottom >= 0 
                        && rect.right >= 0 
                        && rect.top <= html.clientHeight 
                        && rect.left <= html.clientWidth 
                    );
                    if (!isInView) {
                        element.scrollIntoView({block: "center"});
                    }                    
                }
            });
        }        
    }
};
