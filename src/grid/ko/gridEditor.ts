import * as _ from "lodash";
import * as Utils from "@paperbits/common/utils";
import { IViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet as IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetBinding, GridHelper, WidgetContext } from "@paperbits/common/editing";
import { Keys } from "@paperbits/common/keyboard";
import { IWidgetService } from "@paperbits/common/widgets";
import { RouteHandler } from "@paperbits/common/routing";
import { IEventManager } from "@paperbits/common/events";

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
        private readonly viewManager: IViewManager,
        private readonly widgetService: IWidgetService,
        private readonly routeHandler: RouteHandler,
        private readonly eventManager: IEventManager
    ) {
        this.rerenderEditors = this.rerenderEditors.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.actives = {};
    }

    private isModelBeingEdited(binding: IWidgetBinding<any>): boolean {
        const session = this.viewManager.getOpenView();

        if (!session) {
            return false;
        }

        if (session.component.name !== binding.editor) {
            return false;
        }

        return true;
    }

    private getContextualEditor(element: HTMLElement, half: string): IContextCommandSet {
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
            providers: providers
        };

        let contextualEditor: IContextCommandSet;

        if (context.binding.handler) {
            const handler = this.widgetService.getWidgetHandler(context.binding.handler);

            if (handler.getContextualEditor) {
                contextualEditor = handler.getContextualEditor(context);
            }
        }

        if (!contextualEditor) {
            contextualEditor = this.getWidgetContextualEditor(context);
        }

        contextualEditor.element = element;
        contextualEditor.selectionCommands = contextualEditor.selectionCommands || null;
        contextualEditor.hoverCommand = contextualEditor.hoverCommand || null;
        contextualEditor.deleteCommand = contextualEditor.deleteCommand || null;

        return contextualEditor;
    }

    private isModelSelected(binding: IWidgetBinding<any>): boolean {
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

    private onPointerDown(event: MouseEvent): void {
        if (event.ctrlKey) {
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

        const elements = this.getUnderlyingElements();
        const roots = GridHelper.getComponentRoots(elements);
        const element = roots.find(element => GridHelper.getWidgetBinding(element) !== null);

        if (!element) {
            this.viewManager.closeView();
            return;
        }

        const bindings = GridHelper.getParentWidgetBindings(element);

        const windgetIsInContent = bindings.some(x => x.name === "page" || x.name === "email-layout");

        let layoutEditing = false;

        const metadata = this.routeHandler.getCurrentUrlMetadata();

        if (metadata && metadata["routeKind"]) {
            layoutEditing = metadata["routeKind"] === "layout";
        }

        if ((!windgetIsInContent && !layoutEditing && this.viewManager.getHost().name === "content-host")) {
            event.preventDefault();
            event.stopPropagation();

            this.eventManager.dispatchEvent("InactiveLayoutHint");

            return;
        }

        const widgetBinding = GridHelper.getWidgetBinding(element);

        if (!widgetBinding) {
            return;
        }

        if (widgetBinding.readonly) {
            return;
        }

        if (widgetBinding.editor !== "html-editor") {
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
            const contextualEditor = this.getContextualEditor(element, "top");

            if (!contextualEditor) {
                return;
            }

            const config: IHighlightConfig = {
                element: element,
                text: widgetBinding["displayName"],
                color: contextualEditor.color
            };

            this.viewManager.setSelectedElement(config, contextualEditor);
            this.selectedContextualEditor = contextualEditor;
        }
    }

    private onPointerMove(event: MouseEvent): void {
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
                this.renderHighlightedElements();
                break;

            case ViewManagerMode.dragging:
                this.renderDropHandlers();

                break;
        }
    }

    private renderDropHandlers(): void {
        const dragSession = this.viewManager.getDragSession();

        if (!dragSession) {
            return;
        }

        const elements = this.getUnderlyingElements();

        if (elements.some(element => element.classList.contains("dragged-origin"))) {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
            return;
        }

        const acceptorElement = elements
            .filter(element => dragSession.sourceElement !== element)
            .map(element => {
                const binding = GridHelper.getWidgetBinding(element);

                if (binding && binding.handler) {
                    const handler = this.widgetService.getWidgetHandler(binding.handler);

                    if (binding && handler.onDragOver && handler.onDragOver(dragSession)) {
                        return element;
                    }
                }

                return null;
            })
            .find(x => x !== null);

        if (acceptorElement) {
            const childNodes = Array.prototype.slice
                .call(acceptorElement.childNodes)
                .filter(node =>
                    node.nodeName !== "#comment" &&
                    node !== dragSession.sourceElement &&
                    GridHelper.getModel(node) !== null);

            const intersection = _.intersection(childNodes, elements);

            dragSession.targetElement = acceptorElement;
            dragSession.targetBinding = GridHelper.getWidgetBinding(acceptorElement);

            let hoveredElement = acceptorElement;

            const sourceElementFlow = dragSession.sourceBinding.flow || "inline";

            const quadrant = Utils.pointerToClientQuadrant(this.pointerX, this.pointerY, hoveredElement);

            if (intersection.length > 0) {
                hoveredElement = intersection[0];

                dragSession.insertIndex = childNodes.indexOf(hoveredElement);

                const hoveredElementBinding = GridHelper.getWidgetBinding(hoveredElement);

                const hoveredElementFlow = hoveredElementBinding.flow || "inline";

                if (sourceElementFlow === "inline" && hoveredElementFlow === "inline") {
                    if (quadrant.horizontal === "right") {
                        dragSession.insertIndex++;
                    }

                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: quadrant.horizontal,
                        where: "outside"
                    });
                }
                else {
                    if (quadrant.vertical === "bottom") {
                        dragSession.insertIndex++;
                    }

                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: quadrant.vertical,
                        where: "outside"
                    });
                }
            }
            else {
                const hoveredElementBinding = GridHelper.getWidgetBinding(hoveredElement);

                if (hoveredElementBinding.model.widgets.length === 0) {
                    dragSession.insertIndex = 0;

                    this.viewManager.setSplitter({
                        element: hoveredElement,
                        side: quadrant.vertical,
                        where: "inside"
                    });

                    return;
                }
                else {
                    const children = Array.prototype.slice.call(hoveredElement.children);

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
                        dragSession.insertIndex = children.length - 1;

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
        else {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (this.viewManager.mode === ViewManagerMode.selected && event.keyCode === Keys.Delete && this.selectedContextualEditor && this.selectedContextualEditor.deleteCommand) {
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
        return Utils.elementsFromPoint(this.ownerDocument, this.pointerX, this.pointerY);
    }

    private renderHighlightedElements(): void {
        if (this.scrolling || (this.viewManager.mode !== ViewManagerMode.selecting && this.viewManager.mode !== ViewManagerMode.selected)) {
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

    private getWidgetContextualEditor(context: WidgetContext): IContextCommandSet {
        const widgetContextualEditor: IContextCommandSet = {
            color: "#607d8b",
            hoverCommand: {
                color: "#607d8b",
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
            },
            deleteCommand: {
                tooltip: "Delete widget",
                color: "#607d8b",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                },
            },
            selectionCommands: [{
                tooltip: "Edit widget",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#607d8b",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            }]
        };

        return widgetContextualEditor;
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

            const contextualEditor = this.getContextualEditor(element, half);

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

    public attach(ownerDocument: Document): void {
        this.ownerDocument = ownerDocument;
        // Firefox doesn't fire "mousemove" events by some reason
        this.ownerDocument.addEventListener("mousemove", this.onPointerMove.bind(this), true);
        this.ownerDocument.addEventListener("scroll", this.onWindowScroll.bind(this));
        this.ownerDocument.addEventListener("mousedown", this.onPointerDown, true);
        this.ownerDocument.addEventListener("keydown", this.onKeyDown);
    }

    public detach(): void {
        this.ownerDocument.removeEventListener("mousemove", this.onPointerMove.bind(this), true);
        this.ownerDocument.removeEventListener("scroll", this.onWindowScroll.bind(this));
        this.ownerDocument.removeEventListener("mousedown", this.onPointerDown, true);
        this.ownerDocument.removeEventListener("keydown", this.onKeyDown);
    }
}