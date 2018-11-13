import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IEventManager } from "@paperbits/common/events";
import { NavigationItemContract, NavigationItemModel, NavigationEvents } from "@paperbits/common/navigation";
import { NavbarModel } from "../navbarModel";
import { NavbarModelBinder } from "../navbarModelBinder";


export class NavbarViewModelBinder implements IViewModelBinder<NavbarModel, NavbarViewModel> {
    constructor(
        private readonly routeHandler: IRouteHandler,
        private readonly eventManager: IEventManager,
        private readonly navbarModelBinder: NavbarModelBinder
    ) { }

    private navbarItemModelToNavbarItemViewModel(navbarItemModel: NavigationItemModel): NavbarItemViewModel {
        const label = navbarItemModel.label;
        const navbarItemViewModel = new NavbarItemViewModel(label);

        if (navbarItemModel.nodes.length > 0) {
            const results = navbarItemModel.nodes.map(childNode => this.navbarItemModelToNavbarItemViewModel(childNode));

            results.forEach(child => {
                navbarItemViewModel.nodes.push(child);
            });
        }
        else {
            navbarItemViewModel.url(navbarItemModel.url);
            navbarItemViewModel.isActive(navbarItemModel.isActive);
        }

        return navbarItemViewModel;
    }

    public modelToViewModel(navbarModel: NavbarModel, viewModel?: NavbarViewModel): NavbarViewModel {
        if (!viewModel) {
            viewModel = new NavbarViewModel();
        }

        if (navbarModel.root) {
            const navigationRoot = this.navbarItemModelToNavbarItemViewModel(navbarModel.root);
            viewModel.navigationRoot(navigationRoot);
        }
        
        viewModel.pictureSourceUrl(navbarModel.pictureSourceUrl);

        viewModel["widgetBinding"] = {
            displayName: "Navigation bar",

            model: navbarModel,
            editor: "navbar-editor",
            applyChanges: () => {
                this.modelToViewModel(navbarModel, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, async (updatedRootContract: NavigationItemContract) => {
            // TODO: Think about how to unsubscribe from this event.

            if (updatedRootContract.key === navbarModel.rootKey) {
                const updatedRootModel = await this.navbarModelBinder.navigationItemToNavbarItemModel(updatedRootContract);
                viewModel.navigationRoot(this.navbarItemModelToNavbarItemViewModel(updatedRootModel));
            }
        });

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}