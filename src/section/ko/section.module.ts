import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SectionViewModel } from "./sectionViewModel";
import { SectionModelBinder } from "../sectionModelBinder";
import { SectionViewModelBinder } from "./sectionViewModelBinder";

export class SectionModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("section", SectionViewModel);
        injector.bind("sectionModelBinder", SectionModelBinder);
        this.modelBinders.push(injector.resolve("sectionModelBinder"));

        injector.bind("sectionViewModelBinder", SectionViewModelBinder);
        this.viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
    }
}