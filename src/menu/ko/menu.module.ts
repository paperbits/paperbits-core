import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DefaultStyle } from "@paperbits/common/styles";
import { MenuModelBinder } from "../menuModelBinder";
import { MenuViewModelBinder } from "./menuViewModelBinder";


export class MenuModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindToCollection("modelBinders", MenuModelBinder, "menuModelBinder");
        injector.bindToCollection("viewModelBinders", MenuViewModelBinder, "menuViewModelBinder");

        const defaultStyle: DefaultStyle = {
            key: "menu",
            style: {
                default: {
                    category: "appearance",
                    components: {
                        dropdown: {
                            default: {
                                background: {
                                    colorKey: "colors/defaultBg"
                                },
                                category: "appearance",
                                displayName: "Menu dropdown",
                                key: "components/menu/default/components/dropdown/default",
                                shadow: {
                                    shadowKey: "shadows/shadow2"
                                }
                            }
                        },
                        navLink: {
                            active: {
                                allowedStates: ["hover", "focus", "active", "disabled"],
                                displayName: "Navigation link (active)",
                                key: "components/menu/default/components/navLink/active"
                            },
                            default: {
                                allowedStates: ["hover", "focus", "active", "disabled"],
                                displayName: "Navigation link",
                                key: "components/menu/default/components/navLink/default",
                                margin: {
                                    left: 20,
                                    right: 25
                                },
                                padding: {
                                    bottom: 5,
                                    top: 5
                                }
                            }
                        }
                    },
                    displayName: "Normal menu",
                    key: "components/menu/default"
                }
            }
        };

        injector.bindInstanceToCollection("defaultStyles", defaultStyle);
    }
}