
import * as ko from "knockout";
import { Component, Param } from "@paperbits/common/ko/decorators";
import template from "./dropdownContent.html";
import { SelectOption } from "@paperbits/common/ui/selectOption";
import { Keys } from "@paperbits/common";


@Component({
    selector: "dropdown-content",
    template: template
})
export class DropdownContent {
    @Param()
    public optionsCaption: ko.Observable<string>;

    @Param()
    public dropdownContentWidth: ko.Observable<string>;

    @Param()
    public displayedOptions: ko.Observable<SelectOption>;

    @Param()
    public selectedOption: ko.Observable<SelectOption>;

    @Param()
    public value: ko.Observable<string>;

    @Param()
    public onOptionSelected: () => void;

    constructor() {
        this.displayedOptions = ko.observable<SelectOption>();
        this.selectedOption = ko.observable<SelectOption>();
        this.value = ko.observable<string>();
        this.optionsCaption = ko.observable<string>();
    }

    public selectOption(option: SelectOption): void {
        this.selectedOption(option);
        this.value(option.value);

        if (this.onOptionSelected) {
            this.onOptionSelected();
        }
    }

    public onOptionKeyDown(item: SelectOption, event: KeyboardEvent): boolean {
        if (event.key === Keys.Enter || event.key === Keys.Space) {
            this.selectOption(item);
        }

        return true;
    }
}