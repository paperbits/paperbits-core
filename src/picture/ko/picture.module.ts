import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModelBinder } from "../pictureModelBinder";
import { PictureViewModelBinder } from "./pictureViewModelBinder";
import { PictureViewModel } from "./pictureViewModel";
import { IModelBinder } from "@paperbits/common/editing";

export class PictureModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        injector.bindToCollection("modelBinders", PictureModelBinder);
        injector.bindToCollection("viewModelBinders", PictureViewModelBinder);
    }
}