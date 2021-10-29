import { NavbarViewModel } from "./navbarViewModel";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { EventManager, Events } from "@paperbits/common/events";
import { NavigationItemContract, NavigationItemModel, NavigationEvents } from "@paperbits/common/navigation";
import { NavbarModel } from "../navbarModel";
import { NavbarModelBinder } from "../navbarModelBinder";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { Bag } from "@paperbits/common";
import { ComponentFlow } from "@paperbits/common/editing";


export class NavbarViewModelBinder implements ViewModelBinder<NavbarModel, NavbarViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly navbarModelBinder: NavbarModelBinder,
        private readonly styleCompiler: StyleCompiler
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
            navbarItemViewModel.url(navbarItemModel.targetUrl);
            navbarItemViewModel.isActive(navbarItemModel.isActive);
        }

        return navbarItemViewModel;
    }


    public async modelToViewModel(model: NavbarModel, viewModel?: NavbarViewModel, bindingContext?: Bag<any>): Promise<NavbarViewModel> {
        let onUpdate;

        if (!viewModel) {
            viewModel = new NavbarViewModel();

            onUpdate = async (updatedRootModel: NavigationItemModel): Promise<void> => {
                if (updatedRootModel.key === model.rootKey) {
                    viewModel.navigationRoot(this.navbarItemModelToNavbarItemViewModel(updatedRootModel));
                }
            };
        }

        if (model.root) {
            const navigationRoot = this.navbarItemModelToNavbarItemViewModel(model.root);
            viewModel.navigationRoot(navigationRoot);
        }

        viewModel.pictureSourceUrl(model.pictureSourceUrl);
        viewModel.pictureWidth(model.pictureWidth);
        viewModel.pictureHeight(model.pictureHeight);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Navigation bar",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: ComponentFlow.Inline,
            draggable: true,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            },
            onCreate: () => {
                this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, onUpdate);
            },
            onDispose: () => {
                this.eventManager.removeEventListener(NavigationEvents.onNavigationItemUpdate, onUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: NavbarModel): boolean {
        return model instanceof NavbarModel;
    }
}