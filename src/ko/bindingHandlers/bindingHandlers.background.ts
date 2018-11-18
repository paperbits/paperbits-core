import { StyleService } from "@paperbits/styles";
import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background";

ko.bindingHandlers["style"] = {
    update(element, valueAccessor) {
        const value = ko.utils.unwrapObservable(valueAccessor() || {});

        ko.utils.objectForEach(value, function (styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style.setProperty(styleName, styleValue);
        });
    }
};

export class BackgroundBindingHandler {
    constructor(styleService: StyleService) {
        ko.bindingHandlers["background"] = {
            init(element: HTMLElement, valueAccessor) {
                const configuration = valueAccessor();
                const styleObservable = ko.observable();
                const cssObservable = ko.observable();

                const setBackground = async (backgroundModel: BackgroundModel) => {
                    if (element.nodeName === "IMG") {
                        if (backgroundModel.sourceUrl) {
                            element["src"] = backgroundModel.sourceUrl;
                        }
                        return;
                    }

                    const style = {};
                    const css = [];

                    if (backgroundModel.colorKey) {
                        const color = await styleService.getColorByKey(backgroundModel.colorKey);
                        if (color) {
                            Object.assign(style, { "background-color": color.value });
                        }
                        else {
                            console.warn(`Could not find color with key ${backgroundModel.colorKey}`);
                        }
                    }
                    else if (backgroundModel.color) {
                        Object.assign(style, { "background-color": backgroundModel.color || null });
                    }

                    if (backgroundModel.sourceUrl) {
                        Object.assign(style, { "background-image": `url("${ko.unwrap(backgroundModel.sourceUrl)}")` });
                    }
                    else {
                        Object.assign(style, { "background-image": null });
                    }

                    Object.assign(style, { "background-position": backgroundModel.position || null });

                    Object.assign(style, { "background-size": backgroundModel.size || null });

                    Object.assign(style, { "background-repeat": backgroundModel.repeat || "no-repeat" });


                    // if (config.videoUrl) {
                    //     let elements = [].slice.call(element.getElementsByTagName("video"));

                    //     let video: HTMLVideoElement;

                    //     if (elements.length > 0) {
                    //         video = elements[0];
                    //     }
                    //     else {
                    //         video = document.createElement("video");
                    //         video.classList.add("fit", "no-pointer-events")
                    //         element.prepend(video);
                    //     }

                    //     video.src = config.videoUrl;
                    //     video.autoplay = true;
                    //     video.muted = true;
                    //     video.loop = true;
                    // }

                    styleObservable(style);
                    cssObservable(css.join(" "));
                };

                ko.applyBindingsToNode(element, { style: styleObservable, css: cssObservable });

                if (ko.isObservable(configuration)) {
                    configuration.subscribe((newConfiguration) => {
                        if (!newConfiguration) {
                            setBackground({});
                        }
                        else {
                            setBackground(ko.unwrap(newConfiguration));
                        }
                    });
                }

                let initialConfiguration = ko.unwrap(configuration);

                if (!initialConfiguration) {
                    initialConfiguration = {};
                }

                setBackground(initialConfiguration);
            }
        };
    }
}

