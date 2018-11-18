import * as ko from "knockout";
import template from "./colorSelector.html";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";

export interface IntentionItem {
    name: string;
    key: string;
    css: () => string;
}

@Component({
    selector: "color-selector",
    template: template,
    injectable: "colorSelector"
})
export class ColorSelector {
    @Param()
    public readonly selectedColor: KnockoutObservable<string>;

    @Event()
    public  readonly onSelect: (color: string) => void;

    public intentions: IntentionItem[];

    constructor() {
        this.selectIntention = this.selectIntention.bind(this);

        this.intentions = [];
        // let intentionMap = this.intentionsProvider.getIntentions();
        
        // const intentionKeys = intentionMap.container.background["keys"]();
        // let key;

        // while(!(key = intentionKeys.next()).done) {
        //     if (key.value === "name"){
        //         continue;
        //     }
        //     let intention = intentionMap.container.background[key.value];
        //     this.intentions.push({ name: intention.name(), key: key.value, css: intention.params() });
        // }
    }

    public selectIntention(intention: IntentionItem): void {
        if (this.selectedColor) {
            this.selectedColor(intention.key);
        }

        if (this.onSelect) {
            this.onSelect(intention.key);
        }
    }

    public clearIntentions(): void {
        if (this.selectedColor) {
            this.selectedColor(null);
        }

        if (this.onSelect) {
            this.onSelect(null);
        }
    }
}