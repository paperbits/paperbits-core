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

                const onEscapeKeyPressed = () => { htmlEditor.detachFromElement(); };
                eventManager.addEventListener("onEscape", onEscapeKeyPressed);

                const onWidgetEditorClose = () => { htmlEditor.detachFromElement(); };

                eventManager.addEventListener("onWidgetEditorClose", onWidgetEditorClose);

                const onHtmlEditorRequested = () => {
                    if (config.readonly()) {
                        return;
                    }

                    htmlEditor.attachToElement(element);
                };

                htmlEditor.setState(stateObservable());
                htmlEditor.attachToElement(element);

                stateObservable.subscribe(state => {
                    htmlEditor.setState(state);
                });

                eventManager.addEventListener("enableHtmlEditor", onHtmlEditorRequested);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    htmlEditor.detachFromElement();
                    eventManager.removeEventListener("onEscape", onEscapeKeyPressed);
                    eventManager.removeEventListener("onWidgetEditorClose", onWidgetEditorClose);
                    eventManager.removeEventListener("enableHtmlEditor", onHtmlEditorRequested);
                });
            }
        };
    }
}
