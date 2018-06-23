import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background";

ko.bindingHandlers["style"] = {
    update(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});

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
    constructor() {
        ko.bindingHandlers["background"] = {
            init(element: HTMLElement, valueAccessor) {
                var configuration = valueAccessor();
                var styleObservable = ko.observable();
                var cssObservable = ko.observable();

                var setBackground = (backgroundModel: BackgroundModel) => {
                    if (element.nodeName === "IMG") {
                        if (backgroundModel.sourceUrl) {
                            element["src"] = backgroundModel.sourceUrl;
                        }
                        return;
                    }

                    const style = {};
                    const css = [];

                    if (backgroundModel.colorKey) {
                        Object.assign(style, { "background-color": `bg-${backgroundModel.colorKey}` });
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

                    Object.assign(style, { "background-position": backgroundModel.position || null })

                    Object.assign(style, { "background-size": backgroundModel.size || null })

                    Object.assign(style, { "background-repeat": backgroundModel.repeat || "no-repeat" })


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
                }

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

