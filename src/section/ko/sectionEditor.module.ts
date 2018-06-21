import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { SectionLayoutSelector } from "./sectionLayoutSelector";
import { SectionEditor } from "./sectionEditor";

export class SectionEditorModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindComponent("sectionLayoutSelector", (ctx: IInjector, params: {}) => {
            const modelBinderSelector = ctx.resolve<ModelBinderSelector>("modelBinderSelector");
            return new SectionLayoutSelector(modelBinderSelector, params["onSelect"]);
        });

        injector.bind("sectionEditor", SectionEditor);
    }
}