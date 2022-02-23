import * as _ from "lodash";
import * as Utils from "@paperbits/common/utils";
import * as Html from "@paperbits/common/html";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetBinding, GridHelper, WidgetContext, GridItem, ComponentFlow } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager, Events, MouseButton } from "@paperbits/common/events";
import { Router } from "@paperbits/common/routing";
import { ContentModel } from "../../content";
import { PopupHostModel } from "../../popup/popupHostModel";
import { SectionModel } from "../../section";
import { Keys } from "@paperbits/common";


const defaultCommandColor = "#607d8b";

export class GridEditor {
    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private activeContextualCommands: IContextCommandSet;
    private actives: object;
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

        this.actives = {};
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

    private getContextCommands(element: HTMLElement, half: string): IContextCommandSet {
        const bindings = GridHelper.getParentWidgetBindings(element);

        const providers = bindings
            .filter(x => !!x.provides)
            .map(x => x.provides)
            .reduce((acc, val) => acc.concat(val), []);

        let model;
        let binding;

        if (element) {
            model = GridHelper.getModel(element);
            binding = GridHelper.getWidgetBinding(element);
        }

        let parentModel;
        const parentBinding = GridHelper.getParentWidgetBinding(element);

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
                const gridItem = GridHelper.getGridItem(element);
                const parentGridItem = gridItem.getParent(); // closest parent

                if (!parentGridItem) {
                    return;
                }

                const contextualCommands = this.getContextCommands(parentGridItem.element, "top");

                if (!contextualCommands) {
                    return;
                }

                const config: IHighlightConfig = {
                    element: parentGridItem.element,
                    text: parentGridItem.binding.displayName,
                    color: contextualCommands.color
                };

                this.viewManager.setSelectedElement(config, contextualCommands);
                this.activeContextualCommands = contextualCommands;
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

    private isModelSelected(binding: IWidgetBinding<any, any>): boolean {
        const selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return false;
        }

        const selectedBinding = GridHelper.getWidgetBinding(selectedElement.element);

        if (binding !== selectedBinding) {
            return false;
        }

        return true;
    }

    private onMouseClick(event: MouseEvent): void {
        const htmlElement = <HTMLElement>event.target;
        const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

        if (htmlLinkElement) {
            event.preventDefault(); // prevent default event handling for hyperlink controls
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
        const bindings = GridHelper.getParentWidgetBindings(element);

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

        const widgetBinding = GridHelper.getWidgetBinding(element);

        if (!widgetBinding) {
            return;
        }

        if (widgetBinding.readonly) {
            return;
        }

        if (widgetBinding.editor !== "text-block-editor") {
            event.preventDefault();
        }

        if (this.isModelBeingEdited(widgetBinding)) {
            return;
        }

        if (this.isModelSelected(widgetBinding)) {
            if (widgetBinding.editor) {
                this.viewManager.openWidgetEditor(widgetBinding);
            }
        }
        else {
            event.preventDefault(); // To prevent document selection.

            if (element["dragSource"]) { // TODO: Maybe make part of Binding?
                element["dragSource"].beginDrag(element, this.pointerX, this.pointerY);
            }

            this.selectElement({
                binding: widgetBinding,
                element: element
            });
        }
    }

    private selectElement(item: GridItem, scrollIntoView: boolean = true): void {
        if (!item) {
            throw new Error(`Parameter "item" not specified.`);
        }

        const commandSet = this.getContextCommands(item.element, "top");

        if (!commandSet) {
            return;
        }

        const config: IHighlightConfig = {
            element: item.element,
            text: item.binding.displayName,
            color: commandSet.color
        };

        this.viewManager.setSelectedElement(config, commandSet);
        this.activeContextualCommands = commandSet;

        this.selection = item;

        if (scrollIntoView) {
            item.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    private onKeyDown(event: KeyboardEvent): void {
        const selectedElement = this.viewManager.getSelectedElement();

        if (!selectedElement) {
            return;
        }

        const gridItem = GridHelper.getGridItem(selectedElement.element);

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
                    const containerGridItem = GridHelper.getGridItem(<HTMLElement>gridItem.element.firstElementChild, true);
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

    private renderDropHandlers(): void {
        const dragSession = this.viewManager.getDragSession();

        if (!dragSession) {
            return;
        }

        const elements = this.getUnderlyingElements();

        if (elements.length === 0) {
            return;
        }

        const stack = GridHelper.getWidgetStack(elements[1]);

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
        dragSession.targetBinding = GridHelper.getWidgetBinding(acceptingParentElement.element);

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

    private renderContextualCommands(): void {
        let highlightedElement: HTMLElement;
        let highlightedText: string;
        let highlightColor: string;
        const tobeDeleted = Object.keys(this.actives);

        let current = null;

        const elements = this.getUnderlyingElements();

        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const widgetBinding = GridHelper.getWidgetBinding(element);

            if (!widgetBinding) {
                continue;
            }

            if (!widgetBinding || widgetBinding.readonly || widgetBinding === current) {
                continue;
            }

            const index = tobeDeleted.indexOf(widgetBinding.name);
            tobeDeleted.splice(index, 1);

            highlightedElement = element;
            highlightedText = widgetBinding.displayName;

            current = widgetBinding;

            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, element);
            const half = quadrant.vertical;
            const active = this.actives[widgetBinding.name];
            const contextualCommandSet = this.getContextCommands(element, half);

            highlightColor = contextualCommandSet.color;

            if (!active || element !== active.element || half !== active.half) {
                this.viewManager.setContextualCommands(widgetBinding.name, contextualCommandSet);

                this.actives[widgetBinding.name] = {
                    element: element,
                    half: quadrant.vertical
                };
            }
        }

        tobeDeleted.forEach(x => {
            this.viewManager.removeContextualCommands(x);
            delete this.actives[x];
        });

        if (this.activeHighlightedElement !== highlightedElement) {
            this.activeHighlightedElement = highlightedElement;

            this.viewManager.setHighlight({ element: highlightedElement, text: highlightedText, color: highlightColor });
        }
    }

    private findFocusableElement(): GridItem {
        const element = <HTMLElement>Html.findFirst(this.ownerDocument.body,
            node => node.nodeName === "SECTION" && !!GridHelper.getGridItem(<HTMLElement>node));

        if (!element) {
            return null;
        }

        return GridHelper.getGridItem(element);
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
}