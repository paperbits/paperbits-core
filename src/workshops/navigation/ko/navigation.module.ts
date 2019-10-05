import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { NavigationWorkshop } from "./navigation";
import { NavigationDetailsWorkshop } from "./navigationDetails";
import { NavigationItemSelector } from "./navigationItemSelector";
import { NavigationToolButton } from "./navigationToolButton";
import { NavigationModelBinder } from "../navigationModelBinder";
import { NavigationViewModelBinder } from "./navigationViewModelBinder";

export class NavigationWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("navigationWorkshop", NavigationWorkshop);
        injector.bind("navigationDetailsWorkshop", NavigationDetailsWorkshop);
        injector.bind("navigationItemSelector", NavigationItemSelector);
        injector.bindToCollection("workshopSections", NavigationToolButton);
        injector.bindToCollection("modelBinders", NavigationModelBinder, "navigationModelBinder");
        injector.bindToCollection("viewModelBinders", NavigationViewModelBinder, "navigationViewModelBinder");
    }
}