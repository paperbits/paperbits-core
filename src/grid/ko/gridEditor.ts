import * as ko from "knockout";
import * as _ from "lodash";
import * as Arrays from "@paperbits/common/arrays";
import * as Utils from "@paperbits/common/utils";
import * as Html from "@paperbits/common/html";
import * as Objects from "@paperbits/common/objects";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet, ActiveElement, View, IContextCommand } from "@paperbits/common/ui";
import { IWidgetBinding, WidgetContext, GridItem, ComponentFlow, WidgetBinding, GridHelper } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager, Events, MouseButton } from "@paperbits/common/events";
import { Router } from "@paperbits/common/routing";
import { ContentModel } from "../../content";
import { SectionModel } from "../../section";
import { Bag, Keys } from "@paperbits/common";
import { LocalStyles, VariationContract } from "@paperbits/common/styles";
import { StyleHelper } from "@paperbits/styles";


const defaultCommandColor = "#607d8b";

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

        if (editorView.component.name !== gridItem.editor) {
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
            switchToParent: () => {
                if (!parent) {
                    return;
                }

                const contextualCommands = parent.getContextCommands();

                if (!contextualCommands) {
                    return;
                }

                const config: IHighlightConfig = {
                    element: parent.element,
                    text: parent.binding.displayName,
                    color: contextualCommands.color
                };

                this.viewManager.setSelectedElement(config, contextualCommands);
            }
        };

        let contextualCommands: IContextCommandSet;

        if (context.binding?.handler) {
            const handler = this.widgetService.getWidgetHandler(context.binding.handler);

            if (handler.getContextCommands) {
                try {
                    contextualCommands = handler.getContextCommands(context);
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
                if (!context.binding.editor) {
                    return;
                }
                this.viewManager.openWidgetEditor(context.binding);
            }
        };

        contextualCommands.element = gridItem.element;
        contextualCommands.defaultCommand = defaultCommand;

        contextualCommands.selectCommands = contextualCommands.selectCommands !== undefined
            ? contextualCommands.selectCommands
            : defaultCommands.selectCommands;

        contextualCommands.hoverCommands = contextualCommands.hoverCommands !== undefined
            ? contextualCommands.hoverCommands
            : defaultCommands.hoverCommands;

        contextualCommands.deleteCommand = contextualCommands.deleteCommand !== undefined
            ? contextualCommands.deleteCommand
            : defaultCommands.deleteCommand;

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

        if (event.button !== MouseButton.Main) {
            return;
        }

        if (this.viewManager.mode !== ViewManagerMode.selecting &&
            this.viewManager.mode !== ViewManagerMode.selected &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        const gridItems = this.getGridItemsUnderPointer();

        if (gridItems.length > 0) {
            const activeLayer = this.viewManager.getActiveLayer();
            const topGridItem = gridItems[0];

            if (topGridItem.name === "content") {
                if (topGridItem.binding.model.type !== activeLayer) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.eventManager.dispatchEvent("displayInactiveLayoutHint", topGridItem.binding.model);
                    return;
                }
                else {
                    this.viewManager.clearContextualCommands();
                    return;
                }
            }
        }

        const gridItem = this.activeHighlightedGridItem;

        if (!gridItem) {
            return;
        }

        if (gridItem.editor !== "text-block-editor") {
            event.preventDefault();
        }

        if (this.isModelBeingEdited(gridItem)) {
            return;
        }

        if (this.isSelected(gridItem)) {
            const commandSet = gridItem.getContextCommands("");

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
                    this.selectElement(next);
                }

                break;

            case Keys.ArrowUp:
            case Keys.ArrowLeft:
                const prev = gridItem.getPrevSibling();

                if (prev) {
                    this.selectElement(prev);
                }

                break;

            case Keys.PageUp:
                const parent = gridItem.getParent();

                if (parent && !(parent.binding.model instanceof ContentModel)) {
                    this.selectElement(parent);
                }
                break;

            case Keys.PageDown:
                let children;

                if (gridItem.binding.model instanceof SectionModel) {
                    const containerGridItem = this.getGridItem(<HTMLElement>gridItem.element.firstElementChild, true);
                    children = containerGridItem.getChildren();
                }
                else {
                    children = gridItem.getChildren();
                }

                if (children.length > 0) {
                    const firstChild = children[0];
                    this.selectElement(firstChild);
                }
                break;

            case Keys.Enter:
                if (gridItem.binding.editor) {
                    this.viewManager.openWidgetEditor(gridItem.binding);
                }
                break;

            default:
                return; // Ignore other keys
        }
    }

    private selectElement(item: GridItem, scrollIntoView: boolean = true): void {
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
            if (!x.binding.handler || x.binding.readonly) {
                return false;
            }

            const handler = this.widgetService.getWidgetHandler(x.binding.handler);

            if (handler && handler.canAccept && handler.canAccept(dragSession)) {
                return true;
            }

            return false;
        });

        if (!acceptingParent || dragSession.sourceParentBinding === acceptingParent.binding) {
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
        if (this.viewManager.mode === ViewManagerMode.dragging || this.viewManager.mode === ViewManagerMode.pause) {
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

    private getUnderlyingElements(): HTMLElement[] {
        const elements = Utils.elementsFromPoint(this.ownerDocument, this.pointerX, this.pointerY);

        const popupContainer = elements.find(x => x.classList.contains("popup-container"));
        const cutoffIndex = elements.findIndex(x => x.classList.contains("backdrop") || x.classList.contains("popup-backdrop") || x.classList.contains("popup-container"));

        if (cutoffIndex >= 0) {
            elements.splice(cutoffIndex); // removing from stack
        }

        if (popupContainer) {
            elements.splice(cutoffIndex, 0, popupContainer);
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
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete widget",
                color: defaultCommandColor,
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                },
            },
            selectCommands: context.binding?.editor && context.binding?.applyChanges && [{
                controlType: "toolbox-button",
                displayName: `Edit widget`,
                position: "top right",
                color: defaultCommandColor,
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                controlType: "toolbox-splitter"
            },
            {
                controlType: "toolbox-button",
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: defaultCommandColor,
                callback: () => context.switchToParent()
            }]
        };

        return contextCommands;
    }

    private renderContextualCommands(): void {
        let highlightedGridItem: GridItem;
        let highlightedText: string;
        let highlightColor: string;

        const tobeDeleted = Object.keys(this.activeElements);
        const gridItems = this.getGridItemsUnderPointer();

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

        if (this.activeHighlightedGridItem !== highlightedGridItem && highlightedGridItem?.name !== "content") {
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

        if (target.id === "contentEditor") {
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
        this.ownerDocument = ownerDocument;
        // Firefox doesn't fire "pointermove" events by some reason
        this.ownerDocument.addEventListener(Events.MouseMove, this.onPointerMove, true);
        this.ownerDocument.addEventListener(Events.Scroll, this.onWindowScroll);
        this.ownerDocument.addEventListener(Events.MouseDown, this.onPointerDown, true);
        this.ownerDocument.addEventListener(Events.Click, this.onMouseClick, true);
        this.eventManager.addEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.addEventListener("onDelete", this.onDelete);

        document.addEventListener(Events.Focus, (e) => this.onGlobalFocusChange(e), true);
    }

    public dispose(): void {
        this.ownerDocument.removeEventListener(Events.MouseMove, this.onPointerMove, true);
        this.ownerDocument.removeEventListener(Events.Scroll, this.onWindowScroll);
        this.ownerDocument.removeEventListener(Events.MouseDown, this.onPointerDown, true);
        this.ownerDocument.removeEventListener(Events.Click, this.onMouseClick, false);
        this.eventManager.removeEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.removeEventListener("onDelete", this.onDelete);
    }

    /**
     * Returns stack of grid items up to top ancestor.
     * @param element Starting element.
     */
    private getStack(element: HTMLElement): GridItem[] {
        const elements = Html.selfAndParents(element);
        return this.getGridItems(elements);
    }

    private getChildren(gridItem: GridItem): GridItem[] {
        const childElements = Arrays.coerce<HTMLElement>(gridItem.element.children);

        return childElements
            .map(child => this.getGridItem(child))
            .filter(x => !!x && x.binding.model !== gridItem.binding.model);
    }

    private getParent(gridItem: GridItem): GridItem {
        const stack = this.getStack(gridItem.element);

        return stack.length > 1
            ? stack[1]
            : null;
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

    private getGridItemsUnderPointer(includeReadonly: boolean = false): GridItem[] {
        // const elements = this.getUnderlyingElements().filter(x => !x.classList.contains("design") && x.tagName !== "HTML");
        const elements = this.getUnderlyingElements().filter(x => x.tagName !== "HTML");

        return this.getGridItems(elements, includeReadonly);
    }

    private getGridItem(element: HTMLElement, includeReadonly: boolean = false): GridItem {
        const context = ko.contextFor(element);

        if (!context) {
            return null;
        }

        const widgetBinding = context.$data instanceof WidgetBinding
            ? context.$data
            : context.$data?.widgetBinding;

        if (!widgetBinding) {
            return null;
        }

        if (widgetBinding.readonly && !includeReadonly) {
            return null;
        }

        const gridItem: GridItem = {
            name: widgetBinding.name,
            displayName: widgetBinding.displayName,
            readonly: widgetBinding.readonly,
            editor: widgetBinding.editor,
            element: element,
            binding: widgetBinding,
            getParent: () => this.getParent(gridItem),
            getChildren: () => this.getChildren(gridItem),
            getSiblings: () => this.getSiblings(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: (half) => this.getContextCommands(gridItem, half),
            select: (scrollIntoView: boolean = false) => this.selectElement(gridItem, scrollIntoView)
        };

        return gridItem;
    }

    private getStylableGridItem(element: HTMLElement, binding: IWidgetBinding<any, any>): GridItem {
        if (!binding?.handler) {
            return null;
        }

        const handler = this.widgetService.getWidgetHandler(binding.handler);

        if (!handler.getStyleDefinitions) {
            console.warn(`Method "getStyleDefinitions" is not defined on "${binding.displayName}" handler.`);
            return null;
        }

        const styleDefinitions = handler.getStyleDefinitions();

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

        const defaultCommand: IContextCommand = {
            controlType: "toolbox-button",
            name: "edit",
            tooltip: "Edit local style",
            iconClass: "paperbits-icon paperbits-edit-72",
            position: "top right",
            color: "#607d8b",
            callback: () => {
                const styles: LocalStyles = binding.model?.styles;
                const shortKey = "instance/" + styleKeySegments.slice(2).join("/");

                let componentVariation: VariationContract;
                componentVariation = Objects.getObjectAt(shortKey, styles);

                if (!componentVariation) {
                    componentVariation = {
                        key: null, // key will be generated by style editor.
                        ...componentStyleDefinition.defaults
                    };

                    Objects.setValue(shortKey, styles, componentVariation);
                }

                const view: View = {
                    heading: componentStyleDefinition.displayName,
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
                    resize: "vertically horizontally"
                };

                this.viewManager.openViewAsPopup(view);
            }
        };

        const gridItem: GridItem = {
            name: "style",
            displayName: componentStyleDefinition.displayName,
            element: element,
            isStylable: true,
            readonly: false,
            editor: "style-editor",
            getParent: () => this.getParent(gridItem),
            getChildren: () => this.getChildren(gridItem),
            getSiblings: () => this.getSiblings(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: () => {
                const contextualCommands: IContextCommandSet = {
                    element: element,
                    defaultCommand: defaultCommand,
                    selectCommands: [defaultCommand],
                    hoverCommands: null,
                    deleteCommand: null
                };

                return contextualCommands;
            },
            select: (scrollIntoView: boolean = false) => this.selectElement(gridItem, scrollIntoView)
        };

        return gridItem;
    }

    private getGridItems(elements: HTMLElement[], includeReadonly: boolean = false): GridItem[] {
        let currentwidgetBinding: IWidgetBinding<any, any>;
        const stackOfGridItems = [];

        for (const element of elements.reverse()) {
            const widgetGridItem = this.getGridItem(element, includeReadonly);

            if (widgetGridItem && widgetGridItem.binding !== currentwidgetBinding) {
                stackOfGridItems.push(widgetGridItem);
                currentwidgetBinding = widgetGridItem.binding;
            }

            const styleableGridItem = this.getStylableGridItem(element, currentwidgetBinding);

            if (styleableGridItem) {
                stackOfGridItems.push(styleableGridItem);
            }
        }

        return stackOfGridItems.reverse();
    }
}