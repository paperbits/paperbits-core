import { StyleHandler, VariationBagContract, VariationContract } from "@paperbits/common/styles";

const migrate = (style: VariationBagContract): void => { // Temporary migration mechanism
    if (!style) {
        return;
    }

    const menuVariations = Object.keys(style);

    menuVariations.forEach(variationKey => {
        const menuVariation = style[variationKey];
        const components = menuVariation?.components;

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
};

const getDropdownStyle = (key: string): VariationContract => {
    return {
        key: key,
        category: "appearance",
        displayName: "Menu dropdown",
        background: {
            colorKey: "colors/defaultBg"
        },
        shadow: {
            shadowKey: "shadows/shadow2"
        },
        padding: {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5
        },
        components: {
            navLink: {
                default: getNavLinkStyle(`${key}/components/navLink/default`),
                active: getActiveNavLinkStyle(`${key}/components/navLink/active`),
            }
        }
    };
};

const getNavLinkStyle = (key: string): VariationContract => {
    return {
        key: key,
        allowedStates: ["hover", "focus", "active", "disabled"],
        displayName: "Navigation link",
        typography: {
            colorKey: "colors/default"
        }
    };
};

const getActiveNavLinkStyle = (key: string): VariationContract => {
    return {
        key: key,
        allowedStates: ["hover", "focus", "active", "disabled"],
        displayName: "Navigation link (active)",
        typography: {
            fontWeight: "bold"
        }
    };
};

const getMenuStyle = (key: string): any => {
    return {
        default: {
            displayName: "Normal menu",
            key: key,
            category: "appearance",
            components: {
                dropdown: {
                    default: getDropdownStyle(`${key}/components/dropdown/default`)
                },
                navLink: {
                    default: getNavLinkStyle(`${key}/components/navLink/default`),
                    active: getActiveNavLinkStyle(`${key}/components/navLink/active`),
                }
            }
        }
    };
};

const getDefaultStyle = (key: string = `components/menu/default`) => {
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
        case "menu":
            return getMenuStyle(key);
        case "navLink":
            return getNavLinkStyle(key);
        case "dropdown":
            return getDropdownStyle(key);
        default:
            return null;
    }
};

export const MenuStyleHandler: StyleHandler = {
    key: "menu",
    migrate: migrate,
    getDefaultStyle: getDefaultStyle
};