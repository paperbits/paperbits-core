import * as ko from "knockout";
import { StyleSheet } from "@paperbits/common/styles";

export interface ExpandConfig {
    isExpanded: ko.Observable<boolean>;
    width?: number;
    height?: number;
}


ko.bindingHandlers["expand"] = {
    init: (element: HTMLStyleElement, valueAccessor: () => ExpandConfig) => {
        const config = ko.unwrap(valueAccessor());
        const parent = element.parentElement;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `.expanded { width: ${config.width || 600}px ; height: ${config.height || 800}px}`;


        const toggleExpand = () => {
            if (!config.isExpanded()) {
                const expandClass = parent.querySelector(".expandable");
                parent.appendChild(style);
                expandClass.classList.remove("expandable");
                expandClass.classList.add("expanded");
            }
            
            else {
                const expandClass = parent.querySelector(".expanded");
                parent.removeChild(style);
                expandClass.classList.remove("expanded");
                expandClass.classList.add("expandable");
            }
        }

        element.addEventListener("click", toggleExpand);
    }
};