import * as _ from "lodash";
import * as Utils from "@paperbits/common/utils";
import { ViewManager, ViewManagerMode, IHighlightConfig, IContextCommandSet as IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetBinding, GridHelper, WidgetContext, WidgetStackItem } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { EventManager } from "@paperbits/common/events";
import { ContentModel } from "../../content";

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
        private readonly eventManager: EventManager
    ) {
        this.rerenderEditors = this.rerenderEditors.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);

        this.actives = {};
    }

    private isModelBeingEdited(binding: IWidgetBinding<any>): boolean {
        const view = this.viewManager.getOpenView();

        if (!view) {
            return false;
        }

        if (view.component.name !== binding.editor) {
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
            providers: providers,
            switchToParent: (modelType: any) => {
                const stack = GridHelper.getWidgetStack(element);
                const stackItem = stack.find(x => x.binding.model instanceof modelType);

                if (!stackItem) {
                    return;
                }

                const contextualEditor = this.getContextualEditor(stackItem.element, "top");

                if (!contextualEditor) {
                    return;
                }

                const config: IHighlightConfig = {
                    element: stackItem.element,
                    text: stackItem.binding.displayName,
                    color: contextualEditor.color
                };

                this.viewManager.setSelectedElement(config, contextualEditor);
                this.selectedContextualEditor = contextualEditor;
            }
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
        contextualEditor.selectCommands = contextualEditor.selectCommands || null;
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

        if (event.which !== 1) {
            return;
        }

        if (this.viewManager.mode !== ViewManagerMode.selecting &&
            this.viewManager.mode !== ViewManagerMode.selected &&
            this.viewManager.mode !== ViewManagerMode.configure) {
            return;
        }

        const element = this.activeHighlightedElement;
        const bindings = GridHelper.getParentWidgetBindings(element);
        const windgetIsInContent = bindings.some(x => x.model instanceof ContentModel || x.name === "email-layout");

        /* TODO: This is temporary solution */
        const host = this.viewManager.getHost();
        const layoutEditing = host.name === "layout-host";

        if ((!windgetIsInContent && !layoutEditing)) {
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
            event.preventDefault(); // To prevent document selection.

            if (element["dragSource"]) { // TODO: Maybe make part of Binding?
                element["dragSource"].beginDrag(element, this.pointerX, this.pointerY);
            }

            const contextualEditor = this.getContextualEditor(element, "top");

            if (!contextualEditor) {
                return;
            }

            const config: IHighlightConfig = {
                element: this.activeHighlightedElement,
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
            case ViewManagerMode.configure:
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

        if (elements.length === 0) {
            return;
        }

        const stack = GridHelper.getWidgetStack(elements[1]);

        const acceptingParentElement = stack.find(x => {
            if (!x.binding.handler) {
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

        const siblingElement: WidgetStackItem = stack.find(x => x.element.parentElement === acceptingParentElement.element);

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

        const index = elements.findIndex(x => x.classList.contains("backdrop"));

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
            selectCommands: context.binding.editor && context.binding.applyChanges && [{
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
        // Firefox doesn't fire "pointermove" events by some reason
        this.ownerDocument.addEventListener("mousemove", this.onPointerMove, true);
        this.ownerDocument.addEventListener("scroll", this.onWindowScroll);
        this.ownerDocument.addEventListener("mousedown", this.onPointerDown, true);
        this.eventManager.addEventListener("onDelete", this.onDelete);
    }

    public detach(): void {
        this.ownerDocument.removeEventListener("mousemove", this.onPointerMove, true);
        this.ownerDocument.removeEventListener("scroll", this.onWindowScroll);
        this.ownerDocument.removeEventListener("mousedown", this.onPointerDown, true);
        this.eventManager.removeEventListener("onDelete", this.onDelete);
    }
}