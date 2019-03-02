import { SettingsWorkshop } from ".";
import { SettingsWorkshopSection } from "./settingsSection";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";

export class SettingsWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("settingsWorkshop", SettingsWorkshop);
        injector.bindToCollection("workshopSections", SettingsWorkshopSection);
    }
}