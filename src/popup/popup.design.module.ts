import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PopupEditor } from "./ko/popupEditor";
import { IWidgetHandler } from "@paperbits/common/editing";
import { PopupHandlers } from "./popupHandlers";
import { PopupViewModel } from "./ko/popup";
import { PopupModelBinder } from "./popupModelBinder";
import { PopupViewModelBinder } from "./ko/popupViewModelBinder";
import { PopupHostViewModelBinder } from "./ko/popupHostViewModelBinder";
import { PopupHost } from "./ko/popupHost";
import { PopupHostModelBinder } from "./popupHostModelBinder";
import { PopupHyperlinkDetails } from "../workshops/popups/ko/popupHyperlinkDetails";
import { PopupSelector } from "../workshops/popups/ko";
import { PopupHyperlinkProvider } from "@paperbits/common/popups";


export class PopupDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("popup", PopupViewModel);
        injector.bind("popupHost", PopupHost);
        injector.bind("popupEditor", PopupEditor);
        injector.bind("popupSelector", PopupSelector);
        injector.bind("popupHyperlinkDetails", PopupHyperlinkDetails);
        injector.bindToCollection("modelBinders", PopupModelBinder, "popupModelBinder");
        injector.bindToCollection("modelBinders", PopupHostModelBinder, "popupHostModelBinder");
        injector.bindToCollection("viewModelBinders", PopupViewModelBinder);
        injector.bindToCollection("viewModelBinders", PopupHostViewModelBinder, "popupHostViewModelBinder");
        injector.bindToCollection("widgetHandlers", PopupHandlers);
        // injector.bindToCollection("hyperlinkProviders", PopupHyperlinkProvider);
    }
}