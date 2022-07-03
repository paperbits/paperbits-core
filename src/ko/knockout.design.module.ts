import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { KnockoutValidation } from "./validation";

export class KnockoutDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection("autostart", KnockoutValidation);
    }
}