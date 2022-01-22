import * as ko from "knockout";

export interface ComponentDefinition extends ko.components.Component {
    constructor: Function;
    encapsulation?: "none" | "shadowDom";
}
