import * as domino from "domino";
import { HtmlDocumentProvider } from "@paperbits/common/publishing";

declare var global: any;

export class DominoHtmlDocumentProvider implements HtmlDocumentProvider {
    public createDocument(html?: string): Document {
        global.window = domino.createWindow(html);
        global.document = window.document;
        global.navigator = window.navigator;

        return window.document;
    }
}