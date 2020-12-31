import * as ko from "knockout";
import { IHtmlEditor } from "@paperbits/common/editing/IHtmlEditor";
import { EventManager } from "@paperbits/common/events";
import { BlockModel } from "@paperbits/common/text/models";
import { TextblockViewModel } from "../../textblock/ko/textblockViewModel";


export class HtmlEditorBindingHandler {
    constructor(
        eventManager: EventManager,
        htmlEditorFactory: any
    ) {
        ko.bindingHandlers["htmlEditor"] = {
            init(element: HTMLElement, valueAccessor: () => BlockModel[], allBindings: any, viewModel: TextblockViewModel): void {
                const config = valueAccessor();
                const htmlEditor: IHtmlEditor = htmlEditorFactory.createHtmlEditor();

                htmlEditor.onStateChange = (newState: BlockModel[]) => {
                    viewModel["widgetBinding"].model.state = newState;
                    eventManager.dispatchEvent("onContentUpdate"); // TODO: Move this event emit to TextblockEditor
                };

                const onEscapeKeyPressed = () => htmlEditor.detachFromElement();
                eventManager.addEventListener("onEscape", onEscapeKeyPressed);

                const onWidgetEditorClose = () => htmlEditor.detachFromElement();
                eventManager.addEventListener("onWidgetEditorClose", onWidgetEditorClose);

                const onHtmlEditorRequested = () => htmlEditor.enable();

                htmlEditor.attachToElement(element);
                htmlEditor.setState(ko.unwrap(config));

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
