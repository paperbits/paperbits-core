import * as ko from "knockout";
import { Component, OnMounted, Param } from "@paperbits/common/ko/decorators";
import template from "./dropdown.html";
import { SelectOption } from "@paperbits/common/ui/selectOption";

@Component({
    selector: "dropdown",
    template: template
})

export class Dropdown {
    public readonly selectedOption: ko.Observable<SelectOption>;
    public readonly displayedOptions = ko.observable<SelectOption[]>();
    public readonly dropdownContentWidth: ko.Observable<string>;

    @Param()
    public optionsCaption: ko.Observable<string>;
    
    @Param()
    public value: ko.Observable<string>;

    @Param()
    public options: ko.Observable<any[]>;

    @Param()
    public optionsText: ko.Observable<string>;

    @Param()
    public optionsValue: ko.Observable<string>;

    @Param()
    public onOptionSelected: () => void;

    constructor() {
        const width = document.getElementById("dropdown").getBoundingClientRect().width;
        this.dropdownContentWidth = ko.observable<string>(width + "px");

        this.optionsText = ko.observable<string>();
        this.optionsValue = ko.observable<string>();
        this.value = ko.observable<string>();
        this.options = ko.observable<any[]>();
        this.selectedOption = ko.observable<SelectOption>();
        this.displayedOptions = ko.observable<SelectOption[]>();
        this.optionsCaption = ko.observable<string>();
    };

    @OnMounted()
    public initialize(): void {
        setTimeout(() => {
            if (!this.options() || this.options().length === 0) {
                this.displayedOptions([]);
                this.selectedOption({ value: "", text: "" });
                return;
            }

            if (this.isOptionsArrayOfStrings()) {
                this.displayedOptions([{value: "", text: this.optionsCaption()}].concat(this.options().map(o => { return { "value": o, "text": o } })));
            } else {
                if (!this.optionsValue()) {
                    this.optionsValue("value");
                }

                if (!this.optionsText()) {
                    this.optionsText("text");
                }

                this.displayedOptions([{value: "", text: this.optionsCaption()}].concat(this.options().map(o => { return { "value": o[this.optionsValue()], "text": o[this.optionsText()] } })));
            }

            if (!this.value()) {
                this.value(this.displayedOptions()[0].value);
            }

            this.selectedOption(this.displayedOptions().find(x => x.value === this.value()));
            this.value.subscribe(() => this.selectedOption(this.displayedOptions().find(x => x.value === this.value())));
        }, 0);
    }

    private isOptionsArrayOfStrings(): boolean {
        return this.options().every(x => typeof x === "string");
    }
}