import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { NavbarEditor } from "./navbarEditor";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class NavbarEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        const styleGroup: IStyleGroup = { 
            key: "navbar",
            name: "components_navbar", 
            groupName: "Navigation", 
            selectorTemplate: undefined,
            styleTemplate: 
            `<nav class="navbar navbar-expand" data-bind="stylePreview: variant">
                <button class="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse"></div>
                <div class="navbar-nav">
                    <a class="nav-item nav-link" href="#" data-bind="stylable: variant.components.navLink.default, stylePreview:variant.components.navLink.default">
                        Nav item
                    </a>
                    <a class="nav-item nav-link nav-link-active" href="#" data-bind="stylable: variant.components.navLink.active, stylePreview:variant.components.navLink.active">
                        Nav item (active)
                    </a>
                </div>
            </nav>`
        };

        injector.bind("navbarEditor", NavbarEditor);
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}