import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { NavigationWorkshop } from "./navigation";
import { NavigationDetailsWorkshop } from "./navigationDetails";
import { NavigationItemSelector } from "./navigationItemSelector";

export class NavigationWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("navigationWorkshop", NavigationWorkshop);
        injector.bind("navigationDetailsWorkshop", NavigationDetailsWorkshop);
        injector.bind("navigationItemSelector", NavigationItemSelector);
    }
}