import template from "./tooltip.html";
import { Component } from "../decorators/component.decorator";
import { Param } from "../decorators";

@Component({
    selector: "tooltip",
    template: template,
    injectable: "tooltip"
})
export class Tooltip {
    @Param()
    public text: string;
}