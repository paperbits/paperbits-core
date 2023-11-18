import * as Arrays from "@paperbits/common/arrays";
import * as Utils from "@paperbits/common/utils";
import * as Html from "@paperbits/common/html";
import * as Objects from "@paperbits/common/objects";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet, ActiveElement, View, IContextCommand } from "@paperbits/common/ui";
import { switchToParentCommand, defaultCommandColor, deleteWidgetCommand, splitter } from "@paperbits/common/ui/commands";
import { IWidgetBinding, WidgetContext, GridItem, GridHelper } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager, Events } from "@paperbits/common/events";
import { Router } from "@paperbits/common/routing";
import { Bag, Keys, MouseButtons } from "@paperbits/common";
import { LocalStyles, PluginBag, StyleDefinition, VariationContract } from "@paperbits/common/styles";
import { StyleHelper } from "@paperbits/styles";
import { TextblockEditor } from "../../textblock/ko";
import { ComponentFlow } from "@paperbits/common/components";



const contentEditorElementId = "contentEditor";

export class GridEditor {
    private activeHighlightedGridItem: GridItem;
    private scrolling: boolean;
    private scrollTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private activeContextualCommands: IContextCommandSet;
    private activeElements: Bag<ActiveElement>;
    private ownerDocument: Document;
    private selection: GridItem;
    private activeLayer: string;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly widgetService: IWidgetService,
        private readonly eventManager: EventManager,
        private readonly router: Router
    ) {
        this.renderContextualCommands = this.renderContextualCommands.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.initialize = this.initialize.bind(this);
        this.dispose = this.dispose.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.activeElements = {};
    }

    private isModelBeingEdited(gridItem: GridItem): boolean {
        const editorView = this.viewManager.getActiveView();

        if (!editorView) {
            return false;
        }

        let editorComponentName: string;

        if (typeof gridItem.editor === "string") {
            editorComponentName = gridItem.editor;
        }
        else {
            const registration = Reflect.getMetadata("paperbits-component", gridItem.editor);
            editorComponentName = registration.name;
        }

        if (editorView.component.name !== editorComponentName) {
            return false;
        }

        return true;
    }

    private isSelected(gridItem: GridItem): boolean {
        const selectedElement = this.viewManager.getSelectedElement();
        return selectedElement?.element === gridItem.element;
    }

    private getContextCommands(gridItem: GridItem, half: string = null): IContextCommandSet {
        const bindings = GridHelper.getParentWidgetBindings(gridItem.element);

        const providers = bindings
            .filter(x => !!x.provides)
            .map(x => x.provides)
            .reduce((acc, val) => acc.concat(val), []);

        const model = gridItem.binding.model;
        const binding = gridItem.binding;

        let parentModel;
        const parent = gridItem.getParent();
        const parentBinding = parent?.binding;

        if (parentBinding) {
            parentModel = parentBinding.model;
        }

        const context: WidgetContext = {
            gridItem: gridItem,
            parentModel: parentModel,
            parentBinding: parentBinding,
            model: model,
            binding: binding,
            half: half,
            providers: providers,
            openWidgetEditor: () => {
                this.viewManager.openWidgetEditor(binding);
            },
            switchToParent: () => {
                const selectableParent = gridItem.getParent(null, true);

                if (!selectableParent) {
                    return;
                }

                const contextualCommands = selectableParent.getContextCommands();

                if (!contextualCommands) {
                    return;
                }

                this.selectElement(selectableParent);
            },
            switchToChild: () => {
                const children = gridItem.getChildren(this.activeLayer, true);

                if (children.length == 0) {
                    return;
                }

                const firstChild = children[0];
                this.selectElement(firstChild, true);
            },
            deleteWidget: () => {
                parentModel.widgets.remove(model);
                parentBinding.applyChanges();
                this.viewManager.clearContextualCommands();
            }
        };

        let contextualCommands: IContextCommandSet;
        let widgetHandler = this.widgetService.getWidgetHandler(binding);

        if (widgetHandler) {
            if (widgetHandler.getContextCommands) {
                try {
                    contextualCommands = widgetHandler.getContextCommands(context);
                }
                catch (error) {
                    console.warn(`Could not get context commands.`);
                }
            }
        }

        const defaultCommands = this.getDefaultContextCommands(context);

        if (!contextualCommands) {
            contextualCommands = defaultCommands;
        }

        const defaultCommand: IContextCommand = {
            controlType: "toolbox-button",
            callback: () => {
                if (!context.binding) {
                    return;
                }

                this.viewManager.openWidgetEditor(context.binding);
            }
        };

        contextualCommands.element = gridItem.element;
        contextualCommands.defaultCommand = defaultCommand;

        contextualCommands.selectCommands = contextualCommands.selectCommands !== undefined
            ? contextualCommands.selectCommands
            : defaultCommands?.selectCommands;

        contextualCommands.hoverCommands = contextualCommands.hoverCommands !== undefined
            ? contextualCommands.hoverCommands
            : defaultCommands?.hoverCommands;

        contextualCommands.deleteCommand = contextualCommands.deleteCommand !== undefined
            ? contextualCommands.deleteCommand
            : defaultCommands?.deleteCommand;

        return contextualCommands;
    }

    private onMouseClick(event: MouseEvent): void {
        const htmlElement = <HTMLElement>event.target;
        const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

        if (htmlLinkElement) {
            event.preventDefault(); // prevent default event handling for hyperlink controls
        }
    }

    private onPointerMove(event: PointerEvent): void {
        if (this.viewManager.mode === ViewManagerMode.pause) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;

        switch (this.viewManager.mode) {
            case ViewManagerMode.selecting:
            case ViewManagerMode.selected:
            case ViewManagerMode.configure:
                this.renderHighlightedElements();
                break;

            case ViewManagerMode.dragging:
                this.renderDropHandlers();
                break;
        }
    }

    private onPointerDown(event: PointerEvent): void {
        if (event.ctrlKey || event.metaKey || this.viewManager.mode === ViewManagerMode.preview) {
            const htmlElement = <HTMLElement>event.target;
            const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

            if (!htmlLinkElement || htmlLinkElement.href.endsWith("#")) {
                return;
            }

            event.preventDefault();

            this.router.navigateTo(htmlLinkElement.href);
            return;
        }

        if (this.viewManager.mode === ViewManagerMode.pause) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (event.button !== MouseButtons.Main) {
            return;
        }

        if (this.viewManager.mode !== ViewManagerMode.selecting &&
            this.viewManager.mode !== ViewManagerMode.selected &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        const gridItems = this.getGridItemsUnderPointer();

        if (gridItems.length === 0) {
            return;
        }

        const topGridItem = gridItems[0];

        if (topGridItem.binding.readonly) {
            return;
        }

        if (topGridItem.binding.layer !== "*" && topGridItem.binding.layer !== this.activeLayer) {
            event.preventDefault();
            event.stopPropagation();
            this.eventManager.dispatchEvent("displayInactiveLayoutHint", topGridItem.binding.model);
            return;
        }

        if (gridItems.length === 1 && topGridItem.binding.name === "content" && topGridItem.binding.layer === this.activeLayer) {
            this.viewManager.clearContextualCommands();
            return;
        }

        const gridItem = topGridItem;

        if (!gridItem) {
            return;
        }

        if (gridItem.editor !== TextblockEditor) {
            /**
             * Special case for text editor. All other widget element (like a hyperlink or a form submit)
             * should not trigger their default events.
             */
            event.preventDefault();
        }

        if (this.isModelBeingEdited(gridItem)) {
            return;
        }

        if (this.isSelected(gridItem)) {
            const commandSet = gridItem.getContextCommands();

            if (commandSet.defaultCommand) {
                commandSet.defaultCommand.callback();
            }
        }
        else {
            event.preventDefault(); // To prevent document selection.

            if (gridItem.element["dragSource"]) { // TODO: Maybe make part of Binding?
                gridItem.element["dragSource"].beginDrag(gridItem.element, this.pointerX, this.pointerY);
            }

            this.selectElement(gridItem);
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (document.activeElement.id !== contentEditorElementId) {
            return;
        }

        const selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return;
        }

        const gridItem = this.getGridItem(selectedElement.element);

        if (!gridItem) {
            return;
        }

        switch (event.key) {
            case Keys.ArrowDown:
            case Keys.ArrowRight:
                const next = gridItem.getNextSibling();

                if (next) {
                    this.selectElement(next, true);
                }

                break;

            case Keys.ArrowUp:
            case Keys.ArrowLeft:
                const prev = gridItem.getPrevSibling();

                if (prev) {
                    this.selectElement(prev, true);
                }

                break;

            case Keys.PageUp:
                const parent = gridItem.getParent(this.activeLayer, true);

                if (parent) {
                    this.selectElement(parent, true);
                }
                break;

            case Keys.PageDown:
                const children = gridItem.getChildren(this.activeLayer, true);

                if (children.length > 0) {
                    const firstChild = children[0];
                    this.selectElement(firstChild, true);
                }
                break;

            case Keys.Enter:
                // if (gridItem.binding.editor) {
                //     this.viewManager.openWidgetEditor(gridItem.binding);
                // }
                break;

            case Keys.Escape:
                // On Esc we should return forcus to selected element
                break;

            default:
                return; // Ignore other keys
        }
    }

    private selectElement(item: GridItem, scrollIntoView: boolean = false): void {
        if (!item) {
            throw new Error(`Parameter "item" not specified.`);
        }

        const commandSet = item?.getContextCommands();

        if (!commandSet) {
            return;
        }

        const config: IHighlightConfig = {
            element: item.element,
            text: item.displayName,
            color: commandSet.color
        };

        this.viewManager.setSelectedElement(config, commandSet);
        this.activeContextualCommands = commandSet;
        this.selection = item;
        document.getElementById(contentEditorElementId).focus();

        if (scrollIntoView) {
            item.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    private renderDropHandlers(): void {
        const dragSession = this.viewManager.getDragSession();

        if (!dragSession) {
            return;
        }

        const stack = this.getGridItemsUnderPointer();

        if (stack.length === 0) {
            return;
        }

        const acceptingParent = stack.find(x => {
            if (!x.binding) {
                return false;
            }

            const handler = this.widgetService.getWidgetHandler(x.binding);

            if (handler?.canAccept && handler.canAccept(dragSession)) {
                return true;
            }

            return false;
        });

        if (!acceptingParent) {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
            return;
        }

        dragSession.targetElement = acceptingParent.element;
        dragSession.targetBinding = acceptingParent.binding;

        const siblingElement: GridItem = stack.find(x => x.element.parentElement === acceptingParent.element);

        if (siblingElement) {
            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, siblingElement.element);
            const sourceElementFlow = dragSession.sourceBinding.flow || ComponentFlow.Inline;

            dragSession.insertIndex = acceptingParent.binding.model.widgets.indexOf(siblingElement.binding.model);
            const hoveredElementFlow = siblingElement.binding.flow || ComponentFlow.Inline;

            if (sourceElementFlow === ComponentFlow.Inline && hoveredElementFlow === ComponentFlow.Inline) {
                if (quadrant.horizontal === "right") {
                    dragSession.insertIndex++;
                }

                this.viewManager.setSplitter({
                    element: siblingElement.element,
                    side: quadrant.horizontal,
                    where: "outside"
                });
            }
            else {
                if (quadrant.vertical === "bottom") {
                    dragSession.insertIndex++;
                }

                this.viewManager.setSplitter({
                    element: siblingElement.element,
                    side: quadrant.vertical,
                    where: "outside"
                });
            }
        }
        else {
            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, acceptingParent.element);

            if (acceptingParent.binding.model.widgets.length === 0) {
                dragSession.insertIndex = 0;

                this.viewManager.setSplitter({
                    element: acceptingParent.element,
                    side: quadrant.vertical,
                    where: "inside"
                });

                return;
            }
            else {
                const children = Array.prototype.slice.call(acceptingParent.element.children);

                if (quadrant.vertical === "top") {
                    dragSession.insertIndex = 0;

                    const child = children[0];

                    this.viewManager.setSplitter({
                        element: child,
                        side: "top",
                        where: "outside"
                    });
                }
                else {
                    dragSession.insertIndex = children.length;
                    const child = children[dragSession.insertIndex];

                    this.viewManager.setSplitter({
                        element: child,
                        side: "bottom",
                        where: "outside"
                    });
                }
            }
        }
    }

    private onDelete(): void {
        if (this.viewManager.mode === ViewManagerMode.selected && this.activeContextualCommands && this.activeContextualCommands.deleteCommand) {
            this.activeContextualCommands.deleteCommand.callback();
        }
    }

    private onWindowScroll(): void {
        if (this.viewManager.mode === ViewManagerMode.dragging ||
            this.viewManager.mode === ViewManagerMode.pause ||
            this.viewManager.mode === ViewManagerMode.configure) {
            return;
        }

        if (!this.scrolling) {
            this.viewManager.clearContextualCommands();
        }

        this.scrolling = true;

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(this.resetScrolling.bind(this), 100);
    }

    private resetScrolling(): void {
        this.scrolling = false;
        this.renderHighlightedElements();

        if (this.selection) { // also, check for element existence.
            this.selectElement(this.selection, false);
        }
    }

    private getElementsUnderPointer(): HTMLElement[] {
        const elements = Utils.elementsFromPoint(this.ownerDocument, this.pointerX, this.pointerY);

        // Determining cut-off index to exclude from selection stack the elements under popups or dropdowns.
        const cutoffIndex = elements.findIndex(element => getComputedStyle(element).zIndex !== "auto");

        if (cutoffIndex >= 0) {
            elements.splice(cutoffIndex + 1);
        }

        return elements;
    }

    private renderHighlightedElements(): void {
        if (this.scrolling) {
            return;
        }

        this.renderContextualCommands();
    }

    private getDefaultContextCommands(context: WidgetContext): IContextCommandSet {
        const contextCommands: IContextCommandSet = {
            color: defaultCommandColor,
            hoverCommands: [{
                controlType: "toolbox-button",
                color: defaultCommandColor,
                iconClass: "paperbits-icon paperbits-simple-add",
                position: context.half,
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => context.providers,
                        onSelect: (newWidgetModel: any) => {
                            let index = context.parentModel.widgets.indexOf(context.model);

                            if (context.half === "bottom") {
                                index++;
                            }

                            context.parentBinding.model.widgets.splice(index, 0, newWidgetModel);
                            context.parentBinding.applyChanges();

                            this.viewManager.clearContextualCommands();
                        }
                    }
                }
            }],
            deleteCommand: deleteWidgetCommand(context),
            selectCommands: []
        };

        if (context.binding?.editor && context.binding?.applyChanges) {
            contextCommands.selectCommands.push({
                controlType: "toolbox-button",
                displayName: `Edit widget`,
                position: "top right",
                color: defaultCommandColor,
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            });
            contextCommands.selectCommands.push(splitter());
        }

        contextCommands.selectCommands.push(switchToParentCommand(context));

        if (!context.half) { // Not selection mode.
            const handler = this.widgetService.getWidgetHandler(context.binding);

            if (!handler?.getStyleDefinitions) {
                return contextCommands;
            }

            const styleDefinitions = handler.getStyleDefinitions();

            if (!styleDefinitions?.components) {
                return contextCommands;
            }

            const styleEditorCommand = this.getStyleEditorCommand(context.gridItem.element, context.binding, styleDefinitions);

            if (styleEditorCommand) {
                contextCommands.selectCommands.push(styleEditorCommand);
            }
        }

        return contextCommands;
    }

    private renderContextualCommands(): void {
        let highlightedGridItem: GridItem;
        let highlightedText: string;
        let highlightColor: string;

        const tobeDeleted = Object.keys(this.activeElements);
        const gridItems = this.getGridItemsUnderPointer(this.activeLayer);

        tobeDeleted.forEach(key => {
            this.viewManager.removeContextualCommands(key);
            delete this.activeElements[key];
        });

        for (let i = gridItems.length - 1; i >= 0; i--) {
            const gridItem = gridItems[i];
            const index = tobeDeleted.indexOf(gridItem.name);
            tobeDeleted.splice(index, 1);

            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, gridItem.element);
            const half = quadrant.vertical;
            const activeElement = this.activeElements[gridItem.name];
            const contextualCommandSet = gridItem.getContextCommands(half);

            highlightedGridItem = gridItem;
            highlightedText = gridItem.displayName;
            highlightColor = contextualCommandSet.color;

            if (!activeElement || gridItem.element !== activeElement.element || half !== activeElement.half) {
                this.viewManager.setContextualCommands(gridItem.name, contextualCommandSet);

                this.activeElements[gridItem.name] = {
                    key: gridItem.name,
                    element: gridItem.element,
                    half: quadrant.vertical
                };
            }
        }

        const isTopLevelWidget = highlightedGridItem?.binding.name === "content" && this.activeLayer === highlightedGridItem?.binding.layer;

        if (!highlightedGridItem || isTopLevelWidget) {
            this.activeHighlightedGridItem = null;
            this.viewManager.setHighlight(null);
            return;
        }

        if (this.activeHighlightedGridItem !== highlightedGridItem && !highlightedGridItem?.binding?.readonly) {
            this.activeHighlightedGridItem = highlightedGridItem;

            this.viewManager.setHighlight({
                element: highlightedGridItem?.element,
                text: highlightedText, color: highlightColor
            });
        }
    }

    private findFocusableElement(): GridItem {
        const element = <HTMLElement>Html.findFirst(this.ownerDocument.body,
            node => node.nodeName === "SECTION" && !!this.getGridItem(<HTMLElement>node));

        if (!element) {
            return null;
        }

        return this.getGridItem(element);
    }

    private onGlobalFocusChange(event: FocusEvent): void {
        const target = <HTMLElement>event.target;

        if (target.id === contentEditorElementId) {
            if (this.selection) { // also, check for element existence.
                this.selectElement(this.selection, false);
            }
            else {
                const focusableElement = this.findFocusableElement();

                if (focusableElement) {
                    this.selectElement(focusableElement);
                }
            }
        }
        else {
            if (this.selection) {
                const toolbox = target.closest(".toolbox");

                if (toolbox && !toolbox.classList.contains("toolbox-context")) {
                    this.viewManager.clearSelection();
                }
            }
        }
    }

    public initialize(ownerDocument: Document): void {
        this.activeLayer = this.viewManager.getActiveLayer();
        this.ownerDocument = ownerDocument;
        // Firefox doesn't fire "pointermove" events by some reason
        this.ownerDocument.addEventListener(Events.MouseMove, this.onPointerMove, true);
        this.ownerDocument.addEventListener(Events.Scroll, this.onWindowScroll);
        this.ownerDocument.addEventListener(Events.MouseDown, this.onPointerDown, true);
        this.ownerDocument.addEventListener(Events.Click, this.onMouseClick, true);
        this.eventManager.addEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.addEventListener("onDelete", this.onDelete);

        document.addEventListener(Events.Focus, (e) => this.onGlobalFocusChange(e), true);

        // Prevent zoom on the content
        ownerDocument.addEventListener("wheel", (event: WheelEvent): void => {
            if (event.ctrlKey) {
                event.preventDefault();
            }

            const scrollTarget = <HTMLElement>event.target;
            scrollTarget.scrollBy(event.deltaX, event.deltaY);
        }, { passive: false });
    }

    public dispose(): void {
        this.ownerDocument.removeEventListener(Events.MouseMove, this.onPointerMove, true);
        this.ownerDocument.removeEventListener(Events.Scroll, this.onWindowScroll);
        this.ownerDocument.removeEventListener(Events.MouseDown, this.onPointerDown, true);
        this.ownerDocument.removeEventListener(Events.Click, this.onMouseClick, false);
        this.eventManager.removeEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.removeEventListener("onDelete", this.onDelete);
    }

    private getChildren(gridItem: GridItem, layerName?: string): GridItem[] {
        const childElements = Arrays.coerce<HTMLElement>(gridItem.element.querySelectorAll("*"));

        return childElements
            .map(child => this.getGridItem(child, layerName))
            .filter(x => !!x && x.binding.model !== gridItem.binding.model && !x.binding.readonly);
    }

    private getParent(gridItem: GridItem, layerName?: string, excludeReadonly?: boolean): GridItem {
        const elements = Html.parents(gridItem.element);
        const parentGridItems = this.getGridItems(elements, layerName);

        return excludeReadonly
            ? parentGridItems.find(x => !x.binding.readonly)
            : parentGridItems.find(() => true);
    }

    private getSiblings(gridItem: GridItem): GridItem[] {
        const parent = this.getParent(gridItem);
        return this.getChildren(parent);
    }

    private getNextSibling(gridItem: GridItem): GridItem {
        const nextElement = <HTMLElement>gridItem.element.nextElementSibling;

        if (!nextElement) {
            return null;
        }

        return this.getGridItem(nextElement);
    }

    private getPrevSibling(gridItem: GridItem): GridItem {
        const previousElement = <HTMLElement>gridItem.element.previousElementSibling;

        if (!previousElement) {
            return null;
        }

        return this.getGridItem(previousElement);
    }

    private getGridItemsUnderPointer(layerName?: string): GridItem[] {
        const elements = this.getElementsUnderPointer().filter(x => x.tagName !== "HTML");

        return this.getGridItems(elements, layerName);
    }

    private getGridItem(element: HTMLElement, requestedLayerName?: string): GridItem {
        const widgetBinding = GridHelper.getWidgetBinding(element);

        if (!widgetBinding) {
            return null;
        }

        const isAnotherLayer = widgetBinding.layer !== "*" && requestedLayerName && widgetBinding.layer !== requestedLayerName;

        if (isAnotherLayer) {
            return null;
        }

        const gridItem: GridItem = {
            name: widgetBinding.name,
            displayName: widgetBinding.displayName,
            editor: widgetBinding.editor,
            element: element,
            binding: widgetBinding,
            getParent: (layerName: string, excludeReadonly: boolean) => this.getParent(gridItem, layerName, excludeReadonly),
            getChildren: (layerName: string) => this.getChildren(gridItem, layerName),
            getSiblings: () => this.getSiblings(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: (half) => this.getContextCommands(gridItem, half),
            select: (scrollIntoView: boolean = false) => this.selectElement(gridItem, scrollIntoView)
        };

        return gridItem;
    }

    private getStyleEditorCommand(element: HTMLElement, binding: IWidgetBinding<any, any>, styleDefinitions: StyleDefinition): IContextCommand {
        if (!styleDefinitions.components) {
            return null;
        }

        const componentStyleDefinitionWrapper = StyleHelper.getStyleDefinitionWrappers(styleDefinitions.components);
        const match = componentStyleDefinitionWrapper.find(x => element.matches(x.selector));

        if (!match) {
            return null;
        }

        const componentStyleDefinition = match.definition;
        const styleKeySegments = match.key.split("/");

        const styleEditorCommand: IContextCommand = {
            controlType: "toolbox-button",
            name: "edit",
            tooltip: "Edit styles",
            iconClass: "paperbits-icon paperbits-palette",
            position: "top right",
            color: "#607d8b",
            callback: () => {
                const styles: LocalStyles = binding.model?.styles;

                let shortKey: string;

                if (styleKeySegments.length > 2) { // TODO: simplify
                    shortKey = "instance/" + styleKeySegments.slice(2).join("/");
                }
                else {
                    shortKey = "instance";
                }

                let componentVariation: PluginBag;
                componentVariation = Objects.getObjectAt(shortKey, styles);

                if (!componentVariation) {
                    componentVariation = {
                        key: null, // key will be generated by style editor.
                        ...componentStyleDefinition.defaults
                    };

                    Objects.setValue(shortKey, styles, componentVariation);
                }

                const view: View = {
                    heading: `${componentStyleDefinition.displayName} styles`,
                    component: {
                        name: "style-editor",
                        params: {
                            elementStyle: componentVariation,
                            baseComponentKey: componentStyleDefinition.baseComponentKey,
                            plugins: componentStyleDefinition.plugins,
                            onUpdate: (): void => {
                                binding.applyChanges(binding.model);
                            }
                        }
                    },
                    resizing: "vertically horizontally"
                };

                this.viewManager.openViewAsPopup(view);
            }
        };

        return styleEditorCommand;
    }

    private getStylableGridItem(element: HTMLElement): GridItem {
        const binding = GridHelper.getClosestParentBinding(element);

        if (!binding) {
            return null;
        }

        const handler = this.widgetService.getWidgetHandler(binding);

        if (!handler?.getStyleDefinitions) {
            return null;
        }

        const styleDefinitions = handler.getStyleDefinitions();

        if (!styleDefinitions?.components) {
            return null;
        }

        const componentStyleDefinitionWrapper = StyleHelper.getStyleDefinitionWrappers(styleDefinitions.components);
        const match = componentStyleDefinitionWrapper.find(x => element.matches(x.selector));

        if (!match) {
            return null;
        }

        const selectCommands: IContextCommand[] = [];

        const styleEditorCommand = this.getStyleEditorCommand(element, binding, styleDefinitions);

        if (styleEditorCommand) {
            selectCommands.push(styleEditorCommand);
        }

        const componentStyleDefinition = match.definition;

        const gridItem: GridItem = {
            name: "style",
            displayName: componentStyleDefinition.displayName,
            binding: binding,
            element: element,
            editor: "style-editor",
            getParent: () => this.getParent(gridItem),
            getChildren: () => this.getChildren(gridItem),
            getSiblings: () => this.getSiblings(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: () => {
                const contextualCommands: IContextCommandSet = {
                    element: element,
                    defaultCommand: styleEditorCommand,
                    selectCommands: [styleEditorCommand],
                    hoverCommands: null,
                    deleteCommand: null
                };

                return contextualCommands;
            },
            select: (scrollIntoView: boolean = false) => this.selectElement(gridItem, scrollIntoView)
        };

        return gridItem;
    }

    private getGridItems(elements: HTMLElement[], layerName: string): GridItem[] {
        let currentwidgetBinding: IWidgetBinding<any, any>;
        const stackOfGridItems = [];

        for (const element of elements.reverse()) {
            const widgetGridItem = this.getGridItem(element, layerName);

            if (widgetGridItem && widgetGridItem.binding !== currentwidgetBinding) {
                stackOfGridItems.push(widgetGridItem);
                currentwidgetBinding = widgetGridItem.binding;
                continue;
            }

            const styleableGridItem = this.getStylableGridItem(element);

            if (styleableGridItem) {
                stackOfGridItems.push(styleableGridItem);
            }
        }

        return stackOfGridItems.reverse();
    }
}