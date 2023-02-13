import * as ko from "knockout";
import { Component, OnMounted, Param } from "@paperbits/common/ko/decorators";
import template from "./dropdown.html";
import dropdownContent from "./dropdownContent.html";
import { SelectOption } from "@paperbits/common/ui/selectOption";

@Component({
    selector: "dropdown",
    template: template,
    childTemplates: { dropdownContent: dropdownContent }
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
    public onOptionSelected: (option: any) => void;

    @Param()
    public heading: ko.Observable<string>;

    constructor() {
        const width = document.getElementById("dropdown").getBoundingClientRect().width;
        this.dropdownContentWidth = ko.observable<string>(width + "px");

        this.optionsText = ko.observable<string>();
        this.optionsValue = ko.observable<string>();
        this.value = ko.observable<string>();
        this.options = ko.observable<any[]>();
        this.selectedOption = ko.observable<SelectOption>();
        this.displayedOptions = ko.observable<SelectOption[]>([]);
        this.optionsCaption = ko.observable<string>();
        this.heading = ko.observable<string>();

        this.options.subscribe(this.initialize.bind(this));
    };

    @OnMounted()
    public initialize(): void {
        if(!this.options() || this.options().length === 0) {
            return;
        }

        this.displayedOptions([]);

        if (this.isOptionsArrayOfStrings()) {
            const options = this.options().map(opiton => { return { "value": opiton, "text": opiton } });
            this.displayedOptions(this.displayedOptions().concat(options));

            if (this.optionsCaption()) {
                this.displayedOptions([{ value: "", text: this.optionsCaption() }]);
            }

            this.displayedOptions(this.displayedOptions().concat(options));
        }
        else {
            if (!this.optionsValue()) {
                this.optionsValue("value");
            }

            if (!this.optionsText()) {
                this.optionsText("text");
            }

            const options = this.options()
                .map(option => { return { value: option[this.optionsValue()], text: option[this.optionsText()] } });

            this.displayedOptions(this.displayedOptions().concat(options));
        }

        if (!this.value()) {
            this.value(this.displayedOptions()[0].value);
        }

        this.selectedOption(this.displayedOptions().find(x => x.value === this.value()));
    }

    public selectOption(option: any): void {
        this.value(option.value);
        this.selectedOption(option);
    }

    private isOptionsArrayOfStrings(): boolean {
        return this.options().every(x => typeof x === "string");
    }
}