import * as ko from "knockout";
import template from "./confirmation.html";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "confirmation",
    template: template
})
export class Confirmation {
    public readonly message: ko.Observable<string>;

    @Param()
    public getMessage: () => Promise<string>;

    @Event()
    public onConfirm: () => void;

    @Event()
    public onDecline: () => void;

    constructor() {
        this.message = ko.observable("Are you sure?");
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        if (this.getMessage) {
            const message = await this.getMessage();
            this.message(message);
        }
    }

    public confirm(): void {
        if (this.onConfirm) {
            this.onConfirm();
        }
    }

    public decline(): void {
        if (this.onDecline) {
            this.onDecline();
        }
    }
}