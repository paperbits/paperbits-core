
import * as domino from "domino";
import * as XMLHttpRequest from "xhr2";

declare var global: any;

export function createDocument(html?: string): Document {
    global.window = domino.createWindow(html);
    global.document = window.document;
    global.navigator = window.navigator;
    global.XMLHttpRequest = XMLHttpRequest;
    
    return window.document;
}