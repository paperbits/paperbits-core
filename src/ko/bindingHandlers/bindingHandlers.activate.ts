import * as ko from "knockout";
import { ActivateBehavior } from "@paperbits/common/behaviors/behavior.activate";


ko.bindingHandlers["activate"] = {
    init: (element: HTMLElement, valueAccessor: () => (data: any) => void, allBindings, viewModel) => {
        const onActivate = valueAccessor();

        const handle = ActivateBehavior.attach(element, {
            onActivate: onActivate.bind(viewModel),
            data: ko.dataFor(element)
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            handle.detach();
        });

        // const onActivate = valueAccessor();

        // if (!onActivate) {
        //     console.warn(`Callback function for binding handler "activate" in undefined.`);
        //     return;
        // }

        // const data = ko.dataFor(element);
        // const callback = onActivate.bind(viewModel);

        // const onClick = (event: PointerEvent) => {
        //     event.preventDefault();
        //     event.stopImmediatePropagation();
        //     callback(data);
        // };

        // const onKeyDown = (event: KeyboardEvent): void => {
        //     if (event.key !== Keys.Enter && event.key !== Keys.Space) {
        //         return;
        //     }

        //     event.preventDefault();
        //     event.stopImmediatePropagation();
        //     callback(data);
        // };

        // element.addEventListener(Events.KeyDown, onKeyDown);
        // element.addEventListener(Events.Click, onClick);

        // ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
        //     element.removeEventListener(Events.Click, onClick);
        //     element.removeEventListener(Events.KeyDown, onKeyDown);
        // });
    }
};