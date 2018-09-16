import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SectionViewModel } from "./sectionViewModel";
import { SectionModelBinder } from "../sectionModelBinder";
import { SectionViewModelBinder } from "./sectionViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class SectionModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("section", SectionViewModel);
        injector.bind("sectionModelBinder", SectionModelBinder);
        const modelBinders = injector.resolve<IModelBinder[]>("modelBinders");
        modelBinders.push(injector.resolve("sectionModelBinder"));

        injector.bind("sectionViewModelBinder", SectionViewModelBinder);
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
    }
}