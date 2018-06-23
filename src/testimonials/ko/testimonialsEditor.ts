import * as ko from "knockout";
import template from "./testimonialsEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../ko/component";
import { TestimonialsModel } from "../testimonialsModel";

@Component({
    selector: "testimonials-editor",
    template: template,
    injectable: "testimonialsEditor"
})
export class TestimonialsEditor implements IWidgetEditor {
    private testimonialsModel: TestimonialsModel;
    private applyChangesCallback: () => void;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.setWidgetModel = this.setWidgetModel.bind(this);
    }

    public setWidgetModel(testimonialsModel: TestimonialsModel, applyChangesCallback?: () => void): void {
        this.testimonialsModel = testimonialsModel;
        this.applyChangesCallback = applyChangesCallback;
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
