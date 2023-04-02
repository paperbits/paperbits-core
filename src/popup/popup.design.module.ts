import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PopupHyperlinkProvider, PopupPermalinkResolver, PopupService } from "@paperbits/common/popups";
import { PopupSelector } from "../workshops/popups/ko/popupSelector";
import { PopupDetailsWorkshop } from "../workshops/popups/ko/popupDetails";
import { PopupHyperlinkDetails } from "../workshops/popups/ko/popupHyperlinkDetails";
import { PopupsWorkshop } from "../workshops/popups/ko/popups";
import { PopupsToolButton } from "../workshops/popups/ko/popupsToolButton";
import { PopupViewModel } from "./ko/popup";
import { PopupEditor } from "./ko/popupEditor";
import { PopupHost } from "./ko/popupHost";
import { PopupHostViewModelBinder } from "./ko/popupHostViewModelBinder";
import { PopupViewModelBinder } from "./ko/popupViewModelBinder";
import { PopupHandlers } from "./popupHandlers";
import { PopupHostModelBinder } from "./popupHostModelBinder";
import { PopupModelBinder } from "./popupModelBinder";


export class PopupDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("popupHyperlinkDetails", PopupHyperlinkDetails);

        injector.bind("popupsWorkshop", PopupsWorkshop);
        injector.bind("popupDetailsWorkshop", PopupDetailsWorkshop);
        injector.bindToCollection("hyperlinkProviders", PopupHyperlinkProvider, "popupHyperlinkProvider");
        injector.bindToCollection("workshopSections", PopupsToolButton);

        injector.bind("popup", PopupViewModel);
        injector.bind("popupHost", PopupHost);
        injector.bind("popupEditor", PopupEditor);
        injector.bind("popupSelector", PopupSelector);
        injector.bindSingleton("popupService", PopupService);

        injector.bindToCollection("modelBinders", PopupHostModelBinder, "popupHostModelBinder");
        injector.bindToCollection("permalinkResolvers", PopupPermalinkResolver, "popupPermalinkResolver");
        injector.bindToCollection("viewModelBinders", PopupViewModelBinder);
        injector.bindToCollection("widgetHandlers", PopupHandlers);
        injector.bindToCollection("modelBinders", PopupModelBinder, "popupModelBinder");
        injector.bindToCollection("viewModelBinders", PopupHostViewModelBinder, "popupHostViewModelBinder");
    }
}