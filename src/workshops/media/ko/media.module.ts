import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MediaWorkshop } from "./media";
import { MediaDetailsWorkshop } from "./mediaDetails";
import { MediaSelector } from "./mediaSelector";
import { PictureCropper } from "../../cropper/cropper";
import { MediaToolButton } from "./mediaToolButton";
import { MediaHyperlinkProvider } from "@paperbits/common/media";
import { MediaHyperlinkDetails } from "./mediaHyperlinkDetails";

export class MediaWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mediaWorkshop", MediaWorkshop);
        injector.bind("mediaDetailsWorkshop", MediaDetailsWorkshop);
        injector.bind("mediaSelector", MediaSelector);
        injector.bind("mediaHyperlinkDetails", MediaHyperlinkDetails);
        injector.bind("pictureCropper",  PictureCropper);
        injector.bindToCollection("hyperlinkProviders", MediaHyperlinkProvider);
        injector.bindToCollection("workshopSections", MediaToolButton);
    }
}