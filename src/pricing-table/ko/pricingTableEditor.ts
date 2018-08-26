import template from "./pricingTableEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { Component } from "../../ko/component";
import { PricingTableModel } from "../pricingTableModel";

@Component({
    selector: "pricing-table-editor",
    template: template,
    injectable: "pricingTableEditor"
})
export class PricingTableEditor implements IWidgetEditor {
    constructor(private readonly viewManager: IViewManager) { }

    public setWidgetModel(pricingTable: PricingTableModel, applyChangesCallback?: () => void): void { }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
