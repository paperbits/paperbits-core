import * as ko from "knockout";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { IEventManager } from "@paperbits/common/events";
import { TextblockViewModel } from "../../textblock/ko/textblockViewModel";

export class HtmlEditorBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers["htmlEditor"] = {
            init(element: HTMLElement, valueAccessor: () => TextblockViewModel) {
                const config = valueAccessor();
                const stateObservable: KnockoutObservable<Object> = config.state;
                const htmlEditor: IHtmlEditor = ko.unwrap(config.htmlEditor);

                htmlEditor.attachToElement(element);

                const onSelectionChange = () => {
                    eventManager.dispatchEvent("htmlEditorChanged", htmlEditor);
                }
                htmlEditor.addSelectionChangeListener(onSelectionChange);

                const onEscapeKeyPressed = () => { htmlEditor.detachFromElement(); }
                eventManager.addEventListener("onEscape", onEscapeKeyPressed);

                const onWidgetEditorClose = () => { htmlEditor.detachFromElement(); }

                eventManager.addEventListener("onWidgetEditorClose", onWidgetEditorClose);

                const onHtmlEditorRequested = () => {
                    if (config.readonly()) {
                        return;
                    }

                    htmlEditor.attachToElement(element);
                }

                eventManager.addEventListener("enableHtmlEditor", onHtmlEditorRequested);

                htmlEditor.setState(stateObservable());

                stateObservable.subscribe(state => {
                    htmlEditor.setState(state);
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    htmlEditor.detachFromElement();
                    htmlEditor.removeSelectionChangeListener(onSelectionChange);
                    eventManager.removeEventListener("onEscape", onEscapeKeyPressed);
                    eventManager.removeEventListener("onWidgetEditorClose", onWidgetEditorClose);
                    eventManager.removeEventListener("enableHtmlEditor", onHtmlEditorRequested);
                });
            }
        };
    }
}
