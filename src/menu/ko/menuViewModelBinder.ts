import { Bag } from "@paperbits/common";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { NavigationEvents, NavigationItemModel } from "@paperbits/common/navigation";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { MenuContract, MenuModelBinder } from "..";
import { MenuModel } from "../menuModel";
import { MenuItemViewModel } from "./menuItemViewModel";
import { MenuViewModel } from "./menuViewModel";


export class MenuViewModelBinder implements ViewModelBinder<MenuModel, MenuViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly menuModelBinder: MenuModelBinder,
        private readonly styleCompiler: StyleCompiler
    ) { }

    private menuItemModelToViewModel(navitem: NavigationItemModel, level: number = 0): MenuItemViewModel {
        level++;

        const targetUrl = navitem.targetUrl
            ? `${navitem.targetUrl}${navitem.anchor ? "#" + navitem.anchor : ""}`
            : "#";

        const viewModel = new MenuItemViewModel();
        viewModel.label(navitem.label);
        viewModel.isActive(navitem.isActive);
        viewModel.level(level);

        const hyperlink = new HyperlinkModel();
        hyperlink.href = targetUrl;
        hyperlink.targetKey = navitem.targetKey;
        hyperlink.target = navitem.targetWindow;
        viewModel.hyperlink(hyperlink);

        if (navitem.nodes) {
            viewModel.nodes(navitem.nodes.map(childNavitem => this.menuItemModelToViewModel(childNavitem, level)));
        }

        return viewModel;
    }

    public async modelToViewModel(model: MenuModel, viewModel?: MenuViewModel, bindingContext?: Bag<any>): Promise<MenuViewModel> {
        if (!viewModel) {
            viewModel = new MenuViewModel();
        }

        const menuItems = model.items.map(menuItem => this.menuItemModelToViewModel(menuItem));
        viewModel.nodes(menuItems);
        viewModel.layout(model.layout);
        viewModel.roles(model.roles);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const onUpdate = async (updatedRootModel: NavigationItemModel): Promise<void> => {
            if (updatedRootModel.key === model.navigationItem?.key) {
                const menuItems = updatedRootModel.nodes.map(menuItem => this.menuItemModelToViewModel(menuItem));
                viewModel.nodes(menuItems);
            }
        };

        const binding: IWidgetBinding<MenuModel, MenuViewModel> = {
            name: "menu",
            displayName: "Menu",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            // flow: "inline", // Commented out due do discovered backward compatibility issues.
            draggable: true,
            editor: "menu-editor",
            applyChanges: async (updates: MenuModel) => {
                const contract: MenuContract = {
                    type: "menu",
                    navigationItemKey: updates.navigationItem?.key,
                    layout: updates.layout,
                    roles: updates.roles,
                    minHeading: updates.minHeading,
                    maxHeading: updates.maxHeading,
                    styles: updates.styles
                };

                const model1 = await this.menuModelBinder.contractToModel(contract, bindingContext);
                model.navigationItem = model1.navigationItem;
                model.items = model1.items;
                model.layout = model1.layout;
                model.roles = model1.roles;
                model.minHeading = model1.minHeading;
                model.maxHeading = model1.maxHeading;
                model.styles = model1.styles;

                await this.modelToViewModel(model, viewModel, bindingContext);

                this.eventManager.dispatchEvent("onContentUpdate");
            },
            onCreate: () => {
                this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, onUpdate);
            },
            onDispose: () => {
                this.eventManager.removeEventListener(NavigationEvents.onNavigationItemUpdate, onUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: MenuModel): boolean {
        return model instanceof MenuModel;
    }
}