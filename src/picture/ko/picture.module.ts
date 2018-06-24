import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModelBinder } from "../pictureModelBinder";
import { PictureViewModelBinder } from "./pictureViewModelBinder";
import { PictureViewModel } from "./pictureViewModel";
import { IModelBinder } from "@paperbits/common/editing";

export class PictureModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        injector.bind("pictureModelBinder", PictureModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("pictureModelBinder"));

        injector.bind("pictureViewModelBinder", PictureViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("pictureViewModelBinder"));
    }
}