import template from "./tooltip.html";
import { Component, Param } from "@paperbits/common/ko/decorators";

@Component({
    selector: "tooltip",
    template: template,
    injectable: "tooltip"
})
export class Tooltip {
    @Param()
    public text: string;
}