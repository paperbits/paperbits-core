import * as ko from "knockout";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

ko.bindingHandlers["markdown"] = {
    update: async (element: HTMLElement, valueAccessor: () => string): Promise<void> => {
        const markdown = ko.unwrap(valueAccessor());
        const htmlObservable = ko.observable();

        const html = await remark()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeStringify)
            .process(markdown);

        ko.applyBindingsToNode(element, { html: htmlObservable }, null);

        htmlObservable(html);
    }
};