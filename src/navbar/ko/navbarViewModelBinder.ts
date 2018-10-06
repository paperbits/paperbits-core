import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { IRouteHandler } from "@paperbits/common/routing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IEventManager } from "@paperbits/common/events";
import { NavigationItemContract, NavigationItemModel, NavigationEvents } from "@paperbits/common/navigation";
import { NavbarModel } from "../navbarModel";
import { NavbarModelBinder } from "../navbarModelBinder";


export class NavbarViewModelBinder implements IViewModelBinder<NavbarModel, NavbarViewModel> {
    private readonly routeHandler: IRouteHandler;
    private readonly eventManager: IEventManager;
    private readonly navbarModelBinder: NavbarModelBinder;

    constructor(routeHandler: IRouteHandler, eventManager: IEventManager, navbarModelBinder: NavbarModelBinder) {
        this.routeHandler = routeHandler;
        this.eventManager = eventManager;
        this.navbarModelBinder = navbarModelBinder;
    }

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

        const navigationRoot = this.navbarItemModelToNavbarItemViewModel(navbarModel.root);

        viewModel.navigationRoot(navigationRoot);
        viewModel.pictureSourceUrl(navbarModel.pictureSourceUrl);

        const applyChanges = () => {
            this.modelToViewModel(navbarModel, viewModel);
        };

        viewModel["widgetBinding"] = {
            displayName: "Navigation bar",
            
            model: navbarModel,
            editor: "navbar-editor",
            applyChanges: applyChanges
        };

        this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, async (updatedRootContract: NavigationItemContract) => {
            // TODO: Think about how to unsubscribe from this event.

            if (updatedRootContract.key === navbarModel.rootKey) {
                const updatedRootModel = await this.navbarModelBinder.navigationItemToNavbarItemModel(updatedRootContract, this.routeHandler.getCurrentUrl());
                viewModel.navigationRoot(this.navbarItemModelToNavbarItemViewModel(updatedRootModel));
            }
        });

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}