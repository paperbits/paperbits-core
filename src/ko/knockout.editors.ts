import * as ko from "knockout";
import "./bindingHandlers/bindingHandlers.stickTo";
import "./bindingHandlers/bindingHandlers.scrollable";

ko.components.register("spinner", {
    template: `<div class="text-center">Working...</div>`,
    viewModel: () => null
});