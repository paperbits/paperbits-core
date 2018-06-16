import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlogModelBinder } from "../blogModelBinder";

export class BlogModule implements IInjectorModule {
    constructor(
        private modelBinders:any
    ) { }

    register(injector: IInjector): void {
        injector.bind("blogModelBinder", BlogModelBinder);
        this.modelBinders.push(injector.resolve("blogModelBinder"));
    }
}