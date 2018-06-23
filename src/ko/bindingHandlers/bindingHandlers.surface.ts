import * as ko from "knockout";
import * as Utils from '@paperbits/common/utils';
import { IView } from "@paperbits/common/ui/IView";
import "@paperbits/common/extensions";

ko.bindingHandlers["surface"] = {
    init(element: HTMLElement, valueAccessor?: () => IView) {
        const view = valueAccessor();
        const settingsString = localStorage["settings"];

        if (settingsString) {
            const settings = JSON.parse(settingsString);
            const editorSettings = settings[view.component.name];

            if (editorSettings) {
                if (Number.isInteger(editorSettings.width)) {
                    element.style.width = editorSettings.width + "px";
                }

                if (Number.isInteger(editorSettings.height)) {
                    element.style.height = editorSettings.height + "px";
                    element.classList.add("resized-vertically");
                }

                if (Number.isInteger(editorSettings.left)) {
                    if (editorSettings.left + editorSettings.width > document.body.clientWidth) {
                        editorSettings.left = document.body.clientWidth - editorSettings.width;
                    }

                    element.style.left = editorSettings.left + "px";
                }

                if (Number.isInteger(editorSettings.top)) {
                    if (editorSettings.top + editorSettings.height > document.body.clientHeight) {
                        editorSettings.top = document.body.clientHeight - editorSettings.height;
                    }

                    element.style.top = editorSettings.top + "px";
                }
            }
        }

        ko.applyBindingsToNode(element, {
            dragsource: {
                sticky: false,
                payload: "surface",
                preventDragging: (clickedElement: HTMLElement) => {
                    return clickedElement.closest("a, .form, .btn, .toolbox-btn, .toolbox-dropdown") != null;
                },
                ondragend: (): void => {
                    if (!view || !view.component) {
                        return;
                    }

                    const rect = element.getBoundingClientRect();
                    const settingsString = localStorage["settings"];
                    let settings = {};

                    if (settingsString) {
                        settings = JSON.parse(settingsString);
                    }

                    Utils.setValue(`${view.component.name}/top`, settings, Math.floor(rect.top));
                    Utils.setValue(`${view.component.name}/left`, settings, Math.floor(rect.left));

                    localStorage["settings"] = JSON.stringify(settings);
                }
            }
        });

        ko.applyBindingsToNode(element, {
            resizable: {
                directions: view.resize,
                onresize: () => {
                    if (!view || !view.component) {
                        return;
                    }

                    const settingsString = localStorage["settings"];

                    let settings = {};

                    if (settingsString) {
                        settings = JSON.parse(settingsString);
                    }

                    if (view.resize.contains("horizontally")) {
                        Utils.setValue(`${view.component.name}/width`, settings, element.clientWidth);
                    }

                    if (view.resize.contains("vertically")) {
                        Utils.setValue(`${view.component.name}/height`, settings, element.clientHeight)
                    }

                    localStorage["settings"] = JSON.stringify(settings);
                }
            }
        });
    }
};