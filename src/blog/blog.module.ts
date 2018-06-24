import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlogModelBinder } from "./blogModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class BlogModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("blogModelBinder", BlogModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("blogModelBinder"));
    }
}