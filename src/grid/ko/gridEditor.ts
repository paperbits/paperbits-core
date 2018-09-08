import * as _ from "lodash";
import * as Utils from "@paperbits/common/utils";
import { IViewManager, ViewManagerMode, IHighlightConfig, IContextualEditor } from "@paperbits/common/ui";
import { IWidgetBinding, GridHelper } from "@paperbits/common/editing";
import { Keys } from "@paperbits/common/keyboard";

export class GridEditor {
    private activeHighlightedElement: HTMLElement;
    private scrolling: boolean;
    private scrollTimeout: any;
    private pointerX: number;
    private pointerY: number;
    private selectedContextualEditor: IContextualEditor;
    private actives: object;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly ownerDocument: Document
    ) {
        this.viewManager = viewManager;
        this.ownerDocument = ownerDocument;

        this.rerenderEditors = this.rerenderEditors.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.actives = {};
    }

    private isModelBeingEdited(binding: IWidgetBinding): boolean {
        const session = this.viewManager.getWidgetview();

        if (!session) {
            return false;
        }

        if (session.component.name !== binding.editor) {
            return false;
        }

        return true;
    }

    private isModelSelected(binding: IWidgetBinding): boolean {
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
        const element = elements.find(element => {
            return GridHelper.getWidgetBinding(element) !== null;
        });

        if (!element) {
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
            let contextualEditor;

            if (widgetBinding.getContextualEditor) {
                contextualEditor = widgetBinding.getContextualEditor(element, "top");
            }
            else {
                contextualEditor = this.getWidgetContextualEditor(element, "top");
            }

            if (!contextualEditor) {
                return;
            }

            const config: IHighlightConfig = {
                element: element,
                text: widgetBinding["displayName"]
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

        if (elements.some(element => element.classList.contains("placeholder"))) {
            delete dragSession.targetElement;
            delete dragSession.targetBinding;

            this.viewManager.setSplitter(null);
            return;
        }

        const acceptorElement = elements
            .filter(element => dragSession.sourceElement !== element)
            .map(element => {
                const binding = GridHelper.getWidgetBinding(element);

                if (binding && binding.onDragOver && binding.onDragOver(dragSession)) {
                    return element;
                }
                else {
                    return null;
                }
            })
            .find(x => x !== null);

        if (acceptorElement) {
            const childNodes = Array.prototype.slice
                .call(acceptorElement.childNodes)
                .filter(node => GridHelper.getModel(node) !== null && node !== dragSession.sourceElement);

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

    private getWidgetContextualEditor(widgetElement: HTMLElement, activeWidgetHalf: string): IContextualEditor {
        const widgetContextualEditor: IContextualEditor = {
            element: widgetElement,
            color: "#607d8b",
            hoverCommand: {
                color: "#607d8b",
                position: activeWidgetHalf,
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => {
                            const parentElement = GridHelper.getParentElementWithModel(widgetElement);
                            const bindings = GridHelper.getParentWidgetBindings(parentElement);
                            const provided = bindings
                                .filter(x => !!x.provides)
                                .map(x => x.provides)
                                .reduce((acc, val) => acc.concat(val));

                            return provided;
                        },
                        onSelect: (newWidgetModel: any) => {
                            const parentBinding = GridHelper.getParentWidgetBinding(widgetElement);
                            const activeWidgetModel = GridHelper.getModel(widgetElement);

                            let index = parentBinding.model.widgets.indexOf(activeWidgetModel);

                            if (activeWidgetHalf === "bottom") {
                                index++;
                            }

                            parentBinding.model.widgets.splice(index, 0, newWidgetModel);
                            parentBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            },
            deleteCommand: {
                tooltip: "Delete widget",
                color: "#607d8b",
                callback: () => {
                    const widgetModel = GridHelper.getModel(widgetElement);
                    const parentBinding = GridHelper.getParentWidgetBinding(widgetElement);
                    parentBinding.model.widgets.remove(widgetModel);
                    parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                },
            },
            selectionCommands: [{
                tooltip: "Edit widget",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(widgetElement);
                    this.viewManager.openWidgetEditor(binding);
                }
            }]
        };

        return widgetContextualEditor;
    }

    private rerenderEditors(pointerX: number, pointerY: number, elements: HTMLElement[]): void {
        let highlightedElement: HTMLElement;
        let highlightedText: string;
        const tobeDeleted = Object.keys(this.actives);

        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const widgetBinding = GridHelper.getWidgetBinding(element);

            if (!widgetBinding || widgetBinding.readonly) {
                continue;
            }

            const index = tobeDeleted.indexOf(widgetBinding.name);
            tobeDeleted.splice(index, 1);

            highlightedElement = element;
            highlightedText = widgetBinding.displayName;

            const quadrant = Utils.pointerToClientQuadrant(pointerX, pointerY, element);
            const half = quadrant.vertical;
            const active = this.actives[widgetBinding.name];

            if (!active || element !== active.element || half !== active.half) {
                let contextualEditor;

                if (widgetBinding.getContextualEditor) {
                    contextualEditor = widgetBinding.getContextualEditor(element, half);
                }
                else {
                    contextualEditor = this.getWidgetContextualEditor(element, half);
                }

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
            this.viewManager.setHighlight({ element: highlightedElement, text: highlightedText });
        }
    }

    public attach(): void {
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