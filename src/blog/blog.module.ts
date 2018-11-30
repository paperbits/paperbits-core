import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlogModelBinder } from "./blogModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class BlogModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection<IModelBinder>("modelBinders", BlogModelBinder);
    }
}