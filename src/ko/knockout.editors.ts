import * as ko from "knockout";

ko.components.register("spinner", {
    template: `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`,
    viewModel: () => null
});