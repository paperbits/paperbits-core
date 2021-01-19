import { StyleHandler, VariationBagContract, VariationContract } from "@paperbits/common/styles";


export class TabPanelStyleHandler implements StyleHandler {
    public key: string = "tabPanel";

    public migrate(style: VariationBagContract): void {
        if (!style) {
            return;
        }

        const tabPanelVariations = Object.keys(style);

        tabPanelVariations.forEach(variationKey => {
            const variation = style[variationKey];
            const components = variation.components;

            if (!components) {
                return;
            }

            const navItem = components["navItem"];

            if (!navItem) {
                return;
            }

            components["navLink"] = navItem;
            delete components["navItem"];

            const navItemVariations = Object.keys(navItem);

            navItemVariations.forEach(variationKey => {
                const navItemVariation = navItem[variationKey];
                navItemVariation["key"] = navItemVariation["key"].replaceAll("/navItem/", "/navLink/");
            });
        });
    }

    private getNavLinkStyle(key: string): VariationContract {
        return {
            key: key,
            allowedStates: ["hover", "focus", "active", "disabled"],
            displayName: "Navigation link",
            typography: {
                colorKey: "colors/default"
            }
        };
    }

    private getActiveNavLinkStyle(key: string): VariationContract {
        return {
            key: key,
            allowedStates: ["hover", "focus", "active", "disabled"],
            displayName: "Navigation link (active)",
            typography: {
                fontWeight: "bold"
            }
        };
    }

    private getTabPanelStyle(key: string): any {
        return {
            default: {
                displayName: "Normal tab panel",
                key: key,
                category: "appearance",
                components: {
                    navLink: {
                        default: this.getNavLinkStyle(`${key}/components/navLink/default`),
                        active: this.getActiveNavLinkStyle(`${key}/components/navLink/active`),
                    }
                }
            }
        };
    }

    public getDefaultStyle(key: string = `components/tabPanel/default`): VariationContract {
        const regex = /components\/(\w*)\/(\w*)/gm;

        let matches;

        const components = [];

        while ((matches = regex.exec(key)) !== null) {
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const component = matches[1];
            const variation = matches[2];

            components.push(component);
        }

        const component = components[components.length - 1];

        switch (component) {
            case "tabPanel":
                return this.getTabPanelStyle(key);
            case "navLink":
                return this.getNavLinkStyle(key);
            default:
                return null;
        }
    }
}