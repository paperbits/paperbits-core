import * as ko from "knockout";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { IEventManager } from "@paperbits/common/events";
import { BlockModel } from "@paperbits/common/text/models";
import { TextblockViewModel } from "../../textblock/ko/textblockViewModel";


export class HtmlEditorBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers["htmlEditor"] = {
            init(element: HTMLElement, valueAccessor: () => TextblockViewModel) {
                const config = valueAccessor();
                const stateObservable: ko.Observable<BlockModel[]> = config.state;
                const htmlEditor: IHtmlEditor = ko.unwrap(config.htmlEditor);

                const onEscapeKeyPressed = () => htmlEditor.detachFromElement();
                eventManager.addEventListener("onEscape", onEscapeKeyPressed);

                const onWidgetEditorClose = () => htmlEditor.detachFromElement();
                eventManager.addEventListener("onWidgetEditorClose", onWidgetEditorClose);

                const onHtmlEditorRequested = () => {
                    if (config.readonly()) {
                        return;
                    }

                    htmlEditor.enable();
                };
                
                htmlEditor.attachToElement(element);
                htmlEditor.setState(stateObservable());

                stateObservable.subscribe(state => htmlEditor.setState(state));

                eventManager.addEventListener("enableHtmlEditor", onHtmlEditorRequested);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    eventManager.removeEventListener("onEscape", onEscapeKeyPressed);
                    eventManager.removeEventListener("onWidgetEditorClose", onWidgetEditorClose);
                    eventManager.removeEventListener("enableHtmlEditor", onHtmlEditorRequested);
                    htmlEditor.detachFromElement();
                });
            }
        };
    }
}
