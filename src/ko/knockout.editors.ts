import * as ko from "knockout";

ko.components.register("spinner", {
    template: `<div class="spinner"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`,
    viewModel: () => null
});