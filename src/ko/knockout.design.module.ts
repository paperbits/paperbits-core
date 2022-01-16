import * as ko from "knockout";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { KnockoutValidation } from "./validation";


class KnockoutBootstrapper {
    constructor() {
        this.bootstrap();
    }

    public bootstrap(): void {
        document.addEventListener("DOMContentLoaded", () => {
            setImmediate(() => ko.applyBindings(undefined, undefined));
        });
    }
}

export class KnockoutDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        // const componentBinders = injector.resolve<Bag<ComponentBinder>>("componentBinders");
        // componentBinders["knockout"] = new KnockoutComponentBinder();
        injector.bindToCollection("autostart", KnockoutBootstrapper);
        injector.bindToCollection("autostart", KnockoutValidation);
    }
}