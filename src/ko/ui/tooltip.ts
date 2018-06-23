import template from "./tooltip.html";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "tooltip",
    template: template,
    injectable: "tooltip"
})
export class Tooltip {
    constructor(private readonly text: string) { }
}