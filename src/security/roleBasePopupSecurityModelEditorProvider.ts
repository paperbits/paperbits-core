import { ViewManager } from "@paperbits/common/ui";
import { PopupSecurityModelEditorProvider } from "./popupSecurityModelEditorProvider";

export class RoleBasePopupSecurityModelEditorProvider extends PopupSecurityModelEditorProvider {
    constructor(viewManager: ViewManager) {
        super(viewManager, "role-based-security-model-editor");
    }
}
