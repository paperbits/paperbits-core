import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder, ModelBinderSelector } from "@paperbits/common/widgets";
import { SectionModule } from "./section.module";
import { SectionLayoutSelector } from "./sectionLayoutSelector";
import { SectionEditor } from "./sectionEditor";

export class SectionEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new SectionModule(this.modelBinders, this.viewModelBinders));

        injector.bindComponent("sectionLayoutSelector", (ctx: IInjector, params: {}) => {
            const modelBinderSelector = ctx.resolve<ModelBinderSelector>("modelBinderSelector");
            return new SectionLayoutSelector(modelBinderSelector, params["onSelect"]);
        });

        injector.bind("sectionEditor", SectionEditor);
    }
}