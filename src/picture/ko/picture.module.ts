import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PictureModelBinder } from "../pictureModelBinder";
import { PictureViewModelBinder } from "./pictureViewModelBinder";
import { PictureViewModel } from "./pictureViewModel";

export class PictureModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        injector.bindToCollection("modelBinders", PictureModelBinder);
        injector.bindToCollection("viewModelBinders", PictureViewModelBinder);
    }
}