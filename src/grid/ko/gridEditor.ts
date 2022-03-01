import * as ko from "knockout";
import * as _ from "lodash";
import * as Arrays from "@paperbits/common/arrays";
import * as Utils from "@paperbits/common/utils";
import * as Html from "@paperbits/common/html";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet, ActiveElement, View } from "@paperbits/common/ui";
import { IWidgetBinding, WidgetContext, GridItem, ComponentFlow, WidgetBinding } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager, Events, MouseButton } from "@paperbits/common/events";
import { Router } from "@paperbits/common/routing";
import { ContentModel } from "../../content";
import { PopupHostModel } from "../../popup/popupHostModel";
import { SectionModel } from "../../section";
import { Bag, Keys } from "@paperbits/common";


const defaultCommandColor = "#607d8b";

export class GridEditor {
    private activeHighlightedElement: HTMLElement;
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

    private isModelBeingEdited(binding: IWidgetBinding<any, any>): boolean {
        const editorView = this.viewManager.getActiveView();

        if (!editorView) {
            return false;
        }

        if (editorView.component.name !== binding.editor) {
            return false;
        }

        return true;
    }

    private isModelSelected(binding: IWidgetBinding<any, any>): boolean {
        const selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return false;
        }

        const selectedBinding = this.getWidgetBinding(selectedElement.element);

        if (binding !== selectedBinding) {
            return false;
        }

        return true;
    }

    private getContextCommands(element: HTMLElement, half: string): IContextCommandSet {
        const bindings = this.getParentWidgetBindings(element);

        const providers = bindings
            .filter(x => !!x.provides)
            .map(x => x.provides)
            .reduce((acc, val) => acc.concat(val), []);

        let model;
        let binding;

        if (element) {
            model = this.getModel(element);
            binding = this.getWidgetBinding(element);
        }

        let parentModel;
        const parentBinding = this.getParentWidgetBinding(element);

        if (parentBinding) {
            parentModel = parentBinding.model;
        }

        const context: WidgetContext = {
            parentModel: parentModel,
            parentBinding: parentBinding,
            model: model,
            binding: binding,
            half: half,
            providers: providers,
            switchToParent: () => {
                const gridItem = this.getGridItem(element);
                const parentGridItem = gridItem.getParent(); // closest parent

                if (!parentGridItem) {
                    return;
                }

                const contextualCommands = parentGridItem.getContextCommands("top");

                if (!contextualCommands) {
                    return;
                }

                const config: IHighlightConfig = {
                    element: parentGridItem.element,
                    text: parentGridItem.binding.displayName,
                    color: contextualCommands.color
                };

                this.viewManager.setSelectedElement(config, contextualCommands);
            }
        };

        let contextualCommands: IContextCommandSet;

        if (context.binding?.handler) {
            const handler = this.widgetService.getWidgetHandler(context.binding.handler);

            if (handler.getContextCommands) {
                contextualCommands = handler.getContextCommands(context);
            }
        }

        if (!contextualCommands) {
            contextualCommands = this.getDefaultContextCommands(context);
        }

        contextualCommands.element = element;
        contextualCommands.selectCommands = contextualCommands.selectCommands || null;
        contextualCommands.hoverCommands = contextualCommands.hoverCommands || null;
        contextualCommands.deleteCommand = contextualCommands.deleteCommand || null;

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

        const element = this.activeHighlightedElement;
        const bindings = this.getParentWidgetBindings(element);

        const widgetIsInContent = bindings.some(x =>
            x.model instanceof ContentModel ||
            x.model instanceof PopupHostModel ||
            x.name === "email-layout");

        /* TODO: This is temporary solution */
        const host = this.viewManager.getHost();
        const layoutEditing = host.name === "layout-host";
        const emailEditing = host.name === "email-host";

        if (!widgetIsInContent && !layoutEditing && !emailEditing) {
            event.preventDefault();
            event.stopPropagation();

            this.eventManager.dispatchEvent("displayInactiveLayoutHint");
            return;
        }

        const gridItem = this.getGridItem(element);

        if (!gridItem) {
            return;
        }

        if (!gridItem.binding && gridItem.binding?.editor !== "text-block-editor") {
            event.preventDefault();
        }

        if (this.isModelBeingEdited(gridItem.binding)) {
            return;
        }

        if (this.isModelSelected(gridItem.binding)) {
            if (gridItem.binding.editor) {
                this.viewManager.openWidgetEditor(gridItem.binding);
            }
        }
        else {
            event.preventDefault(); // To prevent document selection.

            if (element["dragSource"]) { // TODO: Maybe make part of Binding?
                element["dragSource"].beginDrag(element, this.pointerX, this.pointerY);
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

        const commandSet = item?.getContextCommands("top");

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

        const elements = this.getUnderlyingElements();

        if (elements.length === 0) {
            return;
        }

        const startElement = elements[0].classList.contains("design")
            ? elements[1]
            : elements[0];

        const stack = this.getWidgetStack(startElement);

        const acceptingParentElement = stack.find(x => {
            if (!x.binding.handler || x.binding.readonly) {
                return false;
            }

            const handler = this.widgetService.getWidgetHandler(x.binding.handler);

            if (handler && handler.canAccept && handler.canAccept(dragSession)) {
                return true;
            }

            return false;
        });

        if (!acceptingParentElement || elements.some(element => element.classList.contains("dragged-origin"))) {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
            return;
        }

        dragSession.targetElement = acceptingParentElement.element;
        dragSession.targetBinding = this.getWidgetBinding(acceptingParentElement.element);

        const siblingElement: GridItem = stack.find(x => x.element.parentElement === acceptingParentElement.element);

        if (siblingElement) {
            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, siblingElement.element);
            const sourceElementFlow = dragSession.sourceBinding.flow || ComponentFlow.Inline;

            dragSession.insertIndex = acceptingParentElement.binding.model.widgets.indexOf(siblingElement.binding.model);
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
            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, acceptingParentElement.element);

            if (acceptingParentElement.binding.model.widgets.length === 0) {
                dragSession.insertIndex = 0;

                this.viewManager.setSplitter({
                    element: acceptingParentElement.element,
                    side: quadrant.vertical,
                    where: "inside"
                });

                return;
            }
            else {
                const children = Array.prototype.slice.call(acceptingParentElement.element.children);

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
                tooltip: "Delete widget",
                color: defaultCommandColor,
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                },
            },
            selectCommands: context.binding?.editor && context.binding?.applyChanges && [{
                tooltip: "Edit widget",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: defaultCommandColor,
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: defaultCommandColor,
                callback: () => context.switchToParent()
            }]
        };

        return contextCommands;
    }

    private getActiveGridItems(): GridItem[] {
        const elements = this.getUnderlyingElements();

        if (elements.length === 0) {
            return [];
        }

        const startElement = elements.length > 1 && elements[0].classList.contains("design")
            ? elements[1]
            : elements[0];

        const stack = this.getWidgetStack(startElement);

        return stack;
    }

    private renderContextualCommands(): void {
        let highlightedElement: HTMLElement;
        let highlightedText: string;
        let highlightColor: string;

        const tobeDeleted = Object.keys(this.activeElements);
        const gridItems = this.getActiveGridItems();


        for (let i = gridItems.length - 1; i >= 0; i--) {
            const gridItem = gridItems[i];

            const index = tobeDeleted.indexOf(gridItem.name);
            tobeDeleted.splice(index, 1);

            highlightedElement = gridItem.element;
            highlightedText = gridItem.displayName;

            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, gridItem.element);
            const half = quadrant.vertical;
            const activeElement = this.activeElements[gridItem.name];
            const contextualCommandSet = gridItem.getContextCommands(half);

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

        tobeDeleted.forEach(key => {
            this.viewManager.removeContextualCommands(key);
            delete this.activeElements[key];
        });

        if (this.activeHighlightedElement !== highlightedElement) {
            this.activeHighlightedElement = highlightedElement;

            this.viewManager.setHighlight({ element: highlightedElement, text: highlightedText, color: highlightColor });
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

                if (toolbox) {
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





    private getSelfAndParentElements(element: HTMLElement): HTMLElement[] {
        const stack = [];

        while (element) {
            stack.push(element);
            element = element.parentElement;
        }

        return stack;
    }

    private getWidgetBindingGridItem(element: HTMLElement, includeReadonly: boolean = false): GridItem {
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
            element: element,
            binding: widgetBinding,
            getParent: () => this.getParentGridItem(gridItem),
            getChildren: () => this.getChildGridItems(gridItem),
            getSiblings: () => this.getSiblingGridItems(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: (half) => this.getContextCommands(gridItem.element, half)
        };

        return gridItem;
    }

    private getStylableGridItem(element: HTMLElement): GridItem {
        if (!element["styleable"]) {
            return null;
        }

        const gridItem: GridItem = {
            name: "style",
            displayName: "Style",
            element: element,
            getParent: () => this.getParentGridItem(gridItem),
            getChildren: () => this.getChildGridItems(gridItem),
            getSiblings: () => this.getSiblingGridItems(gridItem),
            getNextSibling: () => this.getNextSibling(gridItem),
            getPrevSibling: () => this.getPrevSibling(gridItem),
            getContextCommands: () => {
                const contextualCommands: IContextCommandSet = {
                    element: element,
                    selectCommands: [{
                        name: "edit",
                        tooltip: "Edit variation",
                        iconClass: "paperbits-icon paperbits-edit-72",
                        position: "top right",
                        color: "#607d8b",
                        callback: () => {
                            const styleable = element["styleable"];
                            const style = styleable.style;

                            console.log("Before");
                            console.log(style);

                            const view: View = {
                                heading: "Local style",
                                component: {
                                    name: "style-editor",
                                    params: {
                                        elementStyle: style,
                                        onUpdate: async () => {
                                            console.log("After");
                                            console.log(style);

                                            styleable.applyChanges();
                                        }
                                    }
                                },
                                resize: "vertically horizontally"
                            };

                            this.viewManager.openViewAsPopup(view);
                        }
                    }],
                    hoverCommands: null,
                    deleteCommand: null
                };

                return contextualCommands;
            }
        };

        return gridItem;
    }

    private getGridItem(element: HTMLElement, includeReadonly: boolean = false): GridItem {
        let gridItem: GridItem;

        gridItem = this.getStylableGridItem(element);

        if (gridItem) {
            return gridItem;
        }

        gridItem = this.getWidgetBindingGridItem(element, includeReadonly);

        return gridItem;
    }

    /**
     * Returns stack of grid items and its acestors.
     * @param element Starting element.
     */
    public getWidgetStack(element: HTMLElement): GridItem[] {
        const elements = this.getSelfAndParentElements(element);
        let lastAdded = null;
        const roots = [];

        elements.reverse().forEach(element => {
            const item = this.getGridItem(element);

            if (!item) {
                return;
            }

            if (lastAdded === item.name) {
                return;
            }

            roots.push(item);

            lastAdded = item.name;
        });

        const result = roots.reverse();

        return result;
    }

    private getSelfAndParentBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const bindings: IWidgetBinding<any, any>[] = [];

        if (context.$data) {
            const widgetBinding = context.$data instanceof WidgetBinding
                ? context.$data // new
                : context.$data.widgetBinding; // legacy 

            bindings.push(widgetBinding);
        }

        let current = null;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                bindings.push(viewModel["widgetBinding"]);
                current = viewModel;
            }
        });

        return bindings;
    }

    private getParentViewModels(element: HTMLElement): any[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const viewModels = [];

        let current = context.$data;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    public getParentWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        const viewModels = this.getParentViewModels(element);

        if (viewModels.length === 0) {
            return null;
        }

        const parentViewModel = viewModels[0];
        return parentViewModel["widgetBinding"];
    }

    public getParentWidgetBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const bindings = [];
        const parentViewModels = this.getParentViewModels(element);

        parentViewModels.forEach(x => {
            const binding = x["widgetBinding"];

            if (binding) {
                bindings.push(binding);
            }
        });

        return bindings;
    }

    public getWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        const bindings = this.getSelfAndParentBindings(element);

        if (bindings.length > 0) {
            return bindings[0];
        }
        else {
            return null;
        }
    }

    public getModel(element: HTMLElement): any {
        const widgetBinding = this.getWidgetBinding(element);
        return widgetBinding?.model || null;
    }

    public getChildGridItems(gridItem: GridItem): GridItem[] {
        const childElements = Arrays.coerce<HTMLElement>(gridItem.element.children);

        return childElements
            .map(child => this.getGridItem(child))
            .filter(x => !!x && x.binding.model !== gridItem.binding.model);
    }

    public getParentGridItem(gridItem: GridItem): GridItem {
        const stack = this.getWidgetStack(gridItem.element);

        return stack.length > 1
            ? stack[1]
            : null;
    }

    public getSiblingGridItems(gridItem: GridItem): GridItem[] {
        const parent = this.getParentGridItem(gridItem);
        return this.getChildGridItems(parent);
    }

    public getNextSibling(gridItem: GridItem): GridItem {
        const nextElement = <HTMLElement>gridItem.element.nextElementSibling;

        if (!nextElement) {
            return null;
        }

        return this.getGridItem(nextElement);
    }

    public getPrevSibling(gridItem: GridItem): GridItem {
        const previousElement = <HTMLElement>gridItem.element.previousElementSibling;

        if (!previousElement) {
            return null;
        }

        return this.getGridItem(previousElement);
    }
}