import * as domino from "domino";

declare var global: any;

export function createDocument(html?: string): Document {
    global.window = domino.createWindow(html);
    global.document = window.document;
    global.navigator = window.navigator;
    
    return window.document;
}