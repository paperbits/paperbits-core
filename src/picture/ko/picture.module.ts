import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModelBinder } from "../pictureModelBinder";
import { PictureViewModelBinder } from "./pictureViewModelBinder";
import { PictureViewModel } from "./pictureViewModel";

export class PictureModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        injector.bind("pictureModelBinder", PictureModelBinder);     
        this.modelBinders.push(injector.resolve("pictureModelBinder"));

        injector.bind("pictureViewModelBinder", PictureViewModelBinder);
        this.viewModelBinders.push(injector.resolve("pictureViewModelBinder"));
    }
}