import * as ko from "knockout";
import { View } from "@paperbits/common/ui";
import "@paperbits/common/extensions";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { PositioningOptions } from "@paperbits/common/ui/positioningOptions";


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
        const editorSettings = await this.localSettings.getSetting<EditorSettings>(view.name);

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
        else {
            if (view.positioning) {
                let positioning: PositioningOptions;

                const defaultOffset = 20;
                const rect = element.getBoundingClientRect();

                if (typeof view.positioning === "string") {
                    switch (view.positioning) {
                        case "left":
                            positioning = {
                                left: defaultOffset,
                                top: (document.body.clientHeight / 2) - (rect.height / 2)
                            };
                            break;
                        case "right":
                            positioning = {
                                right: defaultOffset,
                                top: (document.body.clientHeight / 2) - (rect.height / 2)
                            };
                            break;
                        case "top":
                            positioning = {
                                top: defaultOffset,
                                left: (document.body.clientWidth / 2) - (rect.width / 2)
                            };
                            break;
                        case "bottom":
                            positioning = {
                                bottom: defaultOffset,
                                left: (document.body.clientWidth / 2) - (rect.width / 2)
                            };
                            break;
                        case "center":
                            positioning = {
                                left: (document.body.clientWidth / 2) - (rect.width / 2),
                                top: (document.body.clientHeight / 2) - (rect.height / 2)
                            };
                    }
                }
                else {
                    positioning = view.positioning as PositioningOptions;
                }

                element.style.left = (document.body.clientWidth / 2) - (rect.width / 2) + "px";
                element.style.top = document.body.clientHeight / 2 - rect.height / 2 + "px";
                element.style.left = positioning.left ? positioning.left + "px" : null;
                element.style.top = positioning.top ? positioning.top + "px" : null;
                element.style.right = positioning.right ? positioning.right + "px" : null;
                element.style.bottom = positioning.bottom ? positioning.bottom + "px" : null;
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
                    if (!view?.name) {
                        return;
                    }

                    const rect = element.getBoundingClientRect();
                    await this.localSettings.setSetting(`${view.name}/top`, Math.floor(rect.top));
                    await this.localSettings.setSetting(`${view.name}/left`, Math.floor(rect.left));
                }
            }
        }, null);

        let resizeDirections;

        if (typeof view.resizing === "string") {
            resizeDirections = view.resizing;
        }
        else {
            resizeDirections = view.resizing.directions;
        }

        ko.applyBindingsToNode(element, {
            resizable: {
                directions: resizeDirections,
                onresize: async (): Promise<void> => {
                    if (!view?.name) {
                        return;
                    }

                    if (resizeDirections.includes("horizontally")) {
                        await this.localSettings.setSetting(`${view.name}/width`, element.clientWidth);
                    }

                    if (resizeDirections.includes("vertically")) {
                        await this.localSettings.setSetting(`${view.name}/height`, element.clientHeight);
                    }
                }
            }
        }, null);
    }
}
