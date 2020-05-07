import { StyleService } from "@paperbits/styles";
import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background";

ko.bindingHandlers["style"] = {
    update(element: HTMLElement, valueAccessor): void {
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
            init(element: HTMLElement, valueAccessor: () => BackgroundModel): void {
                const configuration = valueAccessor();
                const styleObservable = ko.observable();

                const setBackground = async (backgroundModel: BackgroundModel) => {
                    if (backgroundModel.sourceUrl) {
                        styleObservable({
                            "background-image": `url("${ko.unwrap(backgroundModel.sourceUrl)}")`,
                            "background-repeat": "no-repeat",
                            "background-size": "cover",
                            "background-position": "center",
                            "background-color": backgroundModel.color
                        });
                    }
                    else if (backgroundModel.color) {
                        styleObservable({
                            "background-color": backgroundModel.color
                        });
                    }
                    else {
                        styleObservable({
                            "background-image": null,
                            "background-repeat": null,
                            "background-size": null,
                            "background-position": null,
                            "background-color": null
                        });
                    }
                };

                ko.applyBindingsToNode(element, { style: styleObservable }, null);

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

