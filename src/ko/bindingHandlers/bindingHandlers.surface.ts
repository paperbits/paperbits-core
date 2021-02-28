import * as ko from "knockout";
import { View } from "@paperbits/common/ui";
import "@paperbits/common/extensions";
import { ISettingsProvider } from "@paperbits/common/configuration";


interface EditorSettings {
    width: number;
    height: number;
    left: number;
    top: number;
}

export class SurfaceBindingHandler {
    constructor(private readonly localSettings: ISettingsProvider) {
        const initialize = this.initialize.bind(this);

        ko.bindingHandlers["surface"] = {
            init(element: HTMLElement, valueAccessor?: () => View): void {
                initialize(element, valueAccessor);
            }
        };
    }

    private async initialize(element: HTMLElement, valueAccessor?: () => View): Promise<void> {
        const view = valueAccessor();
        const editorSettings = await this.localSettings.getSetting<EditorSettings>(view.component.name);

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
                    editorSettings.top = 10;
                }

                element.style.top = editorSettings.top + "px";
            }
        }

        ko.applyBindingsToNode(element, {
            dragsource: {
                sticky: false,
                sourceData: "surface",
                inertia: true,
                preventDragging: (clickedElement: HTMLElement) => {
                    return clickedElement.closest("a, .form, .btn, .toolbox-btn, .toolbox-dropdown .cropbox") !== null;
                },
                ondragend: async (): Promise<void> => {
                    if (!view || !view.component) {
                        return;
                    }

                    const rect = element.getBoundingClientRect();
                    await this.localSettings.setSetting(`${view.component.name}/top`, Math.floor(rect.top));
                    await this.localSettings.setSetting(`${view.component.name}/left`, Math.floor(rect.left));
                }
            }
        }, null);

        let resizeDirections;

        if (typeof view.resize === "string") {
            resizeDirections = view.resize;
        }
        else {
            resizeDirections = view.resize.directions;
        }

        ko.applyBindingsToNode(element, {
            resizable: {
                directions: resizeDirections,
                onresize: async (): Promise<void> => {
                    if (!view || !view.component) {
                        return;
                    }

                    if (resizeDirections.includes("horizontally")) {
                        await this.localSettings.setSetting(`${view.component.name}/width`, element.clientWidth);
                    }

                    if (resizeDirections.includes("vertically")) {
                        await this.localSettings.setSetting(`${view.component.name}/height`, element.clientHeight);
                    }
                }
            }
        }, null);
    }
}
