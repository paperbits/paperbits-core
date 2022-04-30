import * as ko from "knockout";
import template from "./layers.html";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "layers",
    template: template
})
export class Layers {
    constructor() { }

    @OnMounted()
    public async onMounted(): Promise<void> {

    }
}