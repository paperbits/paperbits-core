import styleTemplate from "./styleGuideTemplate.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IStyleGroup } from "@paperbits/common/styles";
import { MenuEditor } from "./menuEditor";
import { MenuHandlers } from "../menuHandlers";


export class MenuEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("menuEditor", MenuEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", MenuHandlers, "menuHandler");

        const styleGroup: IStyleGroup = {
            key: "menu",
            name: "components_menu",
            groupName: "Menus",
            selectorTemplate: null,
            styleTemplate: styleTemplate,
            defaultStyles: {
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
                        navItem: {
                            active: {
                                allowedStates: ["hover", "focus", "active", "disabled"],
                                displayName: "Navigation link",
                                key: "components/menu/default/components/navItem/active"
                            },
                            default: {
                                allowedStates: ["hover", "focus", "active", "disabled"],
                                displayName: "Navigation link",
                                key: "components/menu/default/components/navItem/default",
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
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}