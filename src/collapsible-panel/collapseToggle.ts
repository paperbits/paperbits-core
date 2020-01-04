import template from "./collapseToggle.html";
import { Component, RuntimeComponent } from "@paperbits/common/ko/decorators";


@RuntimeComponent({
    selector: "collapse-toggle"
})
@Component({
    selector: "collapse-toggle",
    template: template
})
export class CollapseToggle { }