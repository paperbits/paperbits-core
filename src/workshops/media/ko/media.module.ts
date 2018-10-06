import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MediaWorkshop } from "./media";
import { MediaDetailsWorkshop } from "./mediaDetails";
import { MediaSelector } from "./mediaSelector";
import { PictureCropper } from "../../cropper/cropper";

export class MediaWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mediaWorkshop", MediaWorkshop);
        injector.bind("mediaDetailsWorkshop", MediaDetailsWorkshop);
        injector.bind("mediaSelector", MediaSelector);
        injector.bind("pictureCropper",  PictureCropper);
    }
}