import * as ko from "knockout";
import { MarkdownBehavior } from "@paperbits/common/behaviors/behavior.markdown"; // Corrected path

ko.bindingHandlers["markdown"] = {
    update: (element: HTMLElement, valueAccessor: () => string): void => {
        const markdown = ko.unwrap(valueAccessor());
        
        // Clean up any previous behavior instance before attaching a new one
        const existingHandle = ko.utils.domData.get(element, "markdownBehaviorHandle");
        if (existingHandle && existingHandle.dispose) {
            existingHandle.dispose();
        }

        const behaviorHandle = MarkdownBehavior.attach(element, markdown);
        ko.utils.domData.set(element, "markdownBehaviorHandle", behaviorHandle); // Store the handle for potential cleanup

        // Ensure dispose is called when the element is removed
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};