import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SectionViewModel } from "./sectionViewModel";
import { SectionModelBinder } from "../sectionModelBinder";
import { SectionViewModelBinder } from "./sectionViewModelBinder";

export class SectionModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("section", SectionViewModel);
        injector.bindToCollection("modelBinders", SectionModelBinder, "sectionModelBinder");
        injector.bindToCollection("viewModelBinders", SectionViewModelBinder, "sectionViewModelBinder");
    }
}