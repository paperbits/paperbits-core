import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PopupHyperlinkProvider } from "@paperbits/common/popups";
import { PopupHyperlinkDetails } from "../workshops/popups/ko/popupHyperlinkDetails";


export class PopupDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection("hyperlinkProviders", PopupHyperlinkProvider);
        injector.bind("popupHyperlinkDetails", PopupHyperlinkDetails);
    }
}