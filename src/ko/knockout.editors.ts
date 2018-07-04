import * as ko from "knockout";

ko.components.register("spinner", {
    template: `<div class="text-center">Working...</div>`,
    viewModel: () => null
});