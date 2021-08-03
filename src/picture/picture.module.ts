import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PictureModelBinder } from "./pictureModelBinder";
import { PictureViewModelBinder } from "./ko/pictureViewModelBinder";
import { PictureViewModel } from "./ko/picture";

export class PictureModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        injector.bindToCollection("modelBinders", PictureModelBinder);
        injector.bindToCollection("viewModelBinders", PictureViewModelBinder);
    }
}