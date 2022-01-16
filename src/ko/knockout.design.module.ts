import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { KnockoutValidation } from "./validation";

export class KnockoutDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        // const componentBinders = injector.resolve<Bag<ComponentBinder>>("componentBinders");
        // componentBinders["knockout"] = new KnockoutComponentBinder();
        injector.bindToCollection("autostart", KnockoutValidation);
    }
}