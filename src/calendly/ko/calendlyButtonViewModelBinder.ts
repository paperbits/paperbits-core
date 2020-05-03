import { CalendlyButton } from "./calendlyCalendlyButtonViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { CalendlyButtonModel } from "../calendlyCalendlyButtonModel";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class CalendlyButtonViewModelBinder implements ViewModelBinder<CalendlyButtonModel, CalendlyButton>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: CalendlyButtonModel, viewModel?: CalendlyButton, bindingContext?: Bag<any>): Promise<CalendlyButton> {
        if (!viewModel) {
            viewModel = new CalendlyButton();
        }

        viewModel.label(model.label);
        viewModel.hyperlink(model.hyperlink);
        viewModel.roles(model.roles);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "CalendlyButton",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "inline",
            editor: "calendlyCalendlyButton-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: CalendlyButtonModel): boolean {
        return model instanceof CalendlyButtonModel;
    }
}