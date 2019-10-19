import template from "./collapsetoggle.html";
import { Component, RuntimeComponent } from "@paperbits/common/ko/decorators";


@RuntimeComponent({
    selector: "collapse-toggle"
})
@Component({
    selector: "collapse-toggle",
    template: template,
    injectable: "collapseToggle"
})
export class CollapseToggle { }