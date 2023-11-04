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
    public onDismiss: ko.Subscribable;

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

    @Param()
    public closeOnSelect: ko.Observable<boolean>;

    constructor() {
        this.optionsText = ko.observable<string>();
        this.optionsValue = ko.observable<string>();
        this.value = ko.observable<string>(null);
        this.options = ko.observable<any[]>();
        this.selectedOption = ko.observable<SelectOption>();
        this.displayedOptions = ko.observable<SelectOption[]>([]);
        this.optionsCaption = ko.observable<string>();
        this.heading = ko.observable<string>();
        this.onDismiss = new ko.subscribable<SelectOption[]>();
        this.closeOnSelect = ko.observable<boolean>(false);
    };

    @OnMounted()
    public initialize(): void {
        this.configureOptions();
        this.options.subscribe(this.configureOptions);

        this.configureSelectedOption();
        this.value.subscribe(this.configureSelectedOption);
    }

    private configureOptions(): void {
        const displayedOptions = [];

        if (this.optionsCaption()) {
            displayedOptions.push({ value: null, text: this.optionsCaption() });
        }

        if (this.isOptionsArrayOfStrings()) {
            const options = this.options()
                .map(option => { return { "value": option, "text": option } });

            displayedOptions.push(...options);
        }
        else {
            const optionValueFieldName = this.optionsValue();
            const optionTextFieldName = this.optionsText();

            const options = this.options()
                .map(option => {
                    return {
                        value: optionValueFieldName ? option[optionValueFieldName] : option,
                        text: optionTextFieldName ? option[optionTextFieldName] : option
                    }
                });

            displayedOptions.push(...options);
        }

        this.displayedOptions(displayedOptions);
    }

    private configureSelectedOption(): void {
        const value = this.value() || null;
        this.selectedOption(this.displayedOptions().find(x => x.value === value));
    }

    public selectOption(option: any): void {
        this.value(option.value);
        this.selectedOption(option);

        if (this.onOptionSelected) {
            this.onOptionSelected(option.value);
        }

        if (this.closeOnSelect()) {
            this.onDismiss.notifySubscribers();
        }
    }

    private isOptionsArrayOfStrings(): boolean {
        return this.options().every(x => typeof x === "string");
    }
}