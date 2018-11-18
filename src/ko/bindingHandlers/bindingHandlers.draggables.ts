import * as ko from "knockout";
import { DragManager } from "@paperbits/common/ui/draggables/dragManager";
import { DragSourceConfig } from "@paperbits/common/ui/draggables/dragSourceConfig";
import { DragTargetConfig } from "@paperbits/common/ui/draggables/dragTargetConfig";

export class DraggablesBindingHandler {
    public constructor(dragManager: DragManager) {

        ko.bindingHandlers["dragsource"] = {
            init(element: HTMLElement, valueAccessor: () => DragSourceConfig) {
                const config = valueAccessor();
                dragManager.registerDragSource(element, config);
            }
        };

        ko.bindingHandlers["dragtarget"] = {
            init(element: HTMLElement, valueAccessor: () => DragTargetConfig) {
                const config = valueAccessor();
                dragManager.registerDragTarget(element, config);
            }
        };

    }
}