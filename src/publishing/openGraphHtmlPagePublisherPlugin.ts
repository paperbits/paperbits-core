import { HtmlPagePublisherPlugin, HtmlPage } from "@paperbits/common/publishing";


export class OpenGraphHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    private appendMetaTag(document: Document, property: string, content: string): void {
        const element: HTMLMetaElement = document.createElement("meta");
        element.setAttribute("property", property);
        element.setAttribute("content", content);

        document.head.appendChild(element);
    }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        if (!page.openGraph) {
            return;
        }

        if (page.openGraph.type) {
            this.appendMetaTag(document, "og:type", page.openGraph.type);
        }

        if (page.openGraph.siteName) {
            this.appendMetaTag(document, "og:site_name", page.openGraph.siteName);
        }

        if (page.openGraph.title) {
            this.appendMetaTag(document, "og:title", page.openGraph.title);
        }

        if (page.openGraph.description) {
            this.appendMetaTag(document, "og:description", page.openGraph.description);
        }

        if (page.openGraph.url) {
            this.appendMetaTag(document, "og:url", page.openGraph.url);
        }

        if (page.openGraph.image) {
            this.appendMetaTag(document, "og:image", page.openGraph.image.url);

            if (page.openGraph.image.width) {
                this.appendMetaTag(document, "og:image:width", page.openGraph.image.width);
            }

            if (page.openGraph.image.height) {
                this.appendMetaTag(document, "og:image:height", page.openGraph.image.height);
            }
        }
    }
}
