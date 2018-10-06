
import * as domino from "domino";
import * as XMLHttpRequest from "xhr2";

declare var global: any;

export function createDocument(html?: string): Document {
    global.window = domino.createWindow(html);
    global.document = window.document;
    global.navigator = window.navigator;
    global.XMLHttpRequest = XMLHttpRequest;
    global.window["getSelection"] = () => { // needed for Slate.
        return {
            anchorNode: null,
            anchorOffset: 0,
            baseNode: null,
            baseOffset: 0,
            extentNode: null,
            extentOffset: 0,
            focusNode: null,
            focusOffset: 0,
            isCollapsed: true,
            rangeCount: 0,
            type: "None"
        };
    };

    return window.document;
}