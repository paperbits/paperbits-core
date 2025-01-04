import * as ko from "knockout";
import { MarkdownBehavior } from "@paperbits/common/behaviors/bahavior.markdown";

ko.bindingHandlers["markdown"] = {
    update: async (element: HTMLElement, valueAccessor: () => string): Promise<void> => {
        const markdown = ko.unwrap(valueAccessor());
        const behavior = new MarkdownBehavior();

        behavior.attach(element, markdown);
    }
};