import * as _ from "lodash";
import * as Utils from "@paperbits/common/utils";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetBinding, GridHelper, WidgetContext, GridItem } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager } from "@paperbits/common/events";
import { Router } from "@paperbits/common/routing";
import { ContentModel } from "../../content";
import { PopupHostModel } from "../../popup/popupHostModel";
import { GridModel } from "../../grid-layout-section";
import { SectionModel } from "../../section";


export class GridEditor {
    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private selectedContextualEditor: IContextCommandSet;
    private actives: object;
    private ownerDocument: Document;


    constructor(
        private readonly viewManager: ViewManager,
        private readonly widgetService: IWidgetService,
        private readonly eventManager: EventManager,
        private readonly router: Router
    ) {
        this.rerenderEditors = this.rerenderEditors.bind(this);
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

                const contextualEditor = this.getContextCommands(parentGridItem.element, "top");

                if (!contextualEditor) {
                    return;
                }

                const config: IHighlightConfig = {
                    element: parentGridItem.element,
                    text: parentGridItem.binding.displayName,
                    color: contextualEditor.color
                };

                this.viewManager.setSelectedElement(config, contextualEditor);
                this.selectedContextualEditor = contextualEditor;
            }
        };

        let contextualEditor: IContextCommandSet;

        if (context.binding.handler) {
            const handler = this.widgetService.getWidgetHandler(context.binding.handler);

            if (handler.getContextCommands) {
                contextualEditor = handler.getContextCommands(context);
            }
        }

        if (!contextualEditor) {
            contextualEditor = this.getDefaultContextCommands(context);
        }

        contextualEditor.element = element;
        contextualEditor.selectCommands = contextualEditor.selectCommands || null;
        contextualEditor.hoverCommands = contextualEditor.hoverCommands || null;
        contextualEditor.deleteCommand = contextualEditor.deleteCommand || null;

        return contextualEditor;
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
        event.preventDefault(); // prevent default event handling for all controls
    }

    private onPointerDown(event: PointerEvent): void {
        if (event.ctrlKey || event.metaKey || this.viewManager.mode === ViewManagerMode.preview) {
            const htmlElement = <HTMLElement>event.target;
            const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

            if (!htmlLinkElement) {
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

        if (event.button !== 0) {
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

        if (!widgetIsInContent && !layoutEditing) {
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

    private selectElement(item: GridItem): void {
        if (!item) {
            throw new Error(`Parameter "item" not specified.`);
        }

        const contextualEditor = this.getContextCommands(item.element, "top");

        if (!contextualEditor) {
            return;
        }

        const config: IHighlightConfig = {
            element: item.element,
            text: item.binding.displayName,
            color: contextualEditor.color
        };

        this.viewManager.setSelectedElement(config, contextualEditor);
        this.selectedContextualEditor = contextualEditor;
    }

    private onPointerMove(event: PointerEvent): void {
        if (this.viewManager.mode === ViewManagerMode.pause) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;

        const elements = this.getUnderlyingElements();

        if (elements.length === 0) {
            return;
        }

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

        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
                const next = gridItem.getNextSibling();

                if (next) {
                    this.selectElement(next);
                }

                break;

            case "ArrowUp":
            case "ArrowLeft":
                const prev = gridItem.getPrevSibling();

                if (prev) {
                    this.selectElement(prev);
                }

                break;

            case "PageUp":
                const parent = gridItem.getParent();

                if (parent && !(parent.binding.model instanceof ContentModel)) {
                    this.selectElement(parent);
                }
                break;

            case "PageDown":
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

            case "Enter":
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
            const sourceElementFlow = dragSession.sourceBinding.flow || "inline";

            dragSession.insertIndex = acceptingParentElement.binding.model.widgets.indexOf(siblingElement.binding.model);
            const hoveredElementFlow = siblingElement.binding.flow || "inline";

            if (sourceElementFlow === "inline" && hoveredElementFlow === "inline") {
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
        if (this.viewManager.mode === ViewManagerMode.selected && this.selectedContextualEditor && this.selectedContextualEditor.deleteCommand) {
            this.selectedContextualEditor.deleteCommand.callback();
        }
    }

    private onWindowScroll(): void {
        if (this.viewManager.mode === ViewManagerMode.dragging || this.viewManager.mode === ViewManagerMode.pause) {
            return;
        }

        if (!this.scrolling) {
            this.viewManager.clearContextualEditors();
        }

        this.scrolling = true;

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(this.resetScrolling.bind(this), 400);
    }

    private resetScrolling(): void {
        this.scrolling = false;
        this.renderHighlightedElements();
    }

    private getUnderlyingElements(): HTMLElement[] {
        const elements = Utils.elementsFromPoint(this.ownerDocument, this.pointerX, this.pointerY);

        const index = elements.findIndex(x => x.classList.contains("backdrop") || x.classList.contains("popup-backdrop"));

        if (index >= 0) {
            elements.splice(index);
        }

        return elements;
    }

    private renderHighlightedElements(): void {
        if (this.scrolling) {
            // || (this.viewManager.mode !== ViewManagerMode.selecting && this.viewManager.mode !== ViewManagerMode.selected)) {
            return;
        }

        const elements = this.getUnderlyingElements();

        if (elements.length > 0) {
            if (elements.some(x =>
                x.classList.contains("editor") ||
                x.classList.contains("balloon") ||
                x.nodeName === "BUTTON")) {
                return;
            }
        }

        this.rerenderEditors(this.pointerX, this.pointerY, elements);
    }

    private getDefaultContextCommands(context: WidgetContext): IContextCommandSet {
        const contextCommands: IContextCommandSet = {
            color: "#607d8b",
            hoverCommands: [{
                color: "#607d8b",
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

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            }],
            deleteCommand: {
                tooltip: "Delete widget",
                color: "#607d8b",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                },
            },
            selectCommands: context.binding.editor && context.binding.applyChanges && [{
                tooltip: "Edit widget",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: "#607d8b",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    context.switchToParent();
                }
            }]
        };

        return contextCommands;
    }

    private async rerenderEditors(pointerX: number, pointerY: number, elements: HTMLElement[]): Promise<void> {
        let highlightedElement: HTMLElement;
        let highlightedText: string;
        let highlightColor: string;
        const tobeDeleted = Object.keys(this.actives);

        let current = null;

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

            const quadrant = Utils.pointerToClientQuadrant(pointerX, pointerY, element);
            const half = quadrant.vertical;
            const active = this.actives[widgetBinding.name];
            const contextualEditor = this.getContextCommands(element, half);

            highlightColor = contextualEditor.color;

            if (!active || element !== active.element || half !== active.half) {
                this.viewManager.setContextualEditor(widgetBinding.name, contextualEditor);

                this.actives[widgetBinding.name] = {
                    element: element,
                    half: quadrant.vertical
                };
            }
        }

        tobeDeleted.forEach(x => {
            this.viewManager.removeContextualEditor(x);
            delete this.actives[x];
        });

        if (this.activeHighlightedElement !== highlightedElement) {
            this.activeHighlightedElement = highlightedElement;
            this.viewManager.setHighlight({ element: highlightedElement, text: highlightedText, color: highlightColor });
        }
    }

    public initialize(ownerDocument: Document): void {
        this.ownerDocument = ownerDocument;
        // Firefox doesn't fire "pointermove" events by some reason
        this.ownerDocument.addEventListener("mousemove", this.onPointerMove, true);
        this.ownerDocument.addEventListener("scroll", this.onWindowScroll);
        this.ownerDocument.addEventListener("mousedown", this.onPointerDown, true);
        this.ownerDocument.addEventListener("click", this.onMouseClick, true);
        this.eventManager.addEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.addEventListener("onDelete", this.onDelete);
    }

    public dispose(): void {
        this.ownerDocument.removeEventListener("mousemove", this.onPointerMove, true);
        this.ownerDocument.removeEventListener("scroll", this.onWindowScroll);
        this.ownerDocument.removeEventListener("mousedown", this.onPointerDown, true);
        this.ownerDocument.removeEventListener("click", this.onMouseClick, false);
        this.eventManager.removeEventListener("onKeyDown", this.onKeyDown);
        this.eventManager.removeEventListener("onDelete", this.onDelete);

    }
}