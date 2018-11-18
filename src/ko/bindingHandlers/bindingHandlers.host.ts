import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { GlobalEventHandler } from "@paperbits/common/events";
import { IViewManager, ViewManagerMode, HostDocument } from "@paperbits/common/ui";
import { IRouteHandler } from "@paperbits/common/routing";

export class HostBindingHandler {
    private readonly layoutViewModel: KnockoutObservable<any>;
    private hostDocument: HostDocument;

    constructor(
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly viewManager: IViewManager,
        private readonly routeHandler: IRouteHandler
    ) {
        this.refreshContent = this.refreshContent.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);

        this.layoutViewModel = ko.observable();

        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: () => any) => {

                this.routeHandler.addRouteChangeListener(this.onRouteChange);

                const config = valueAccessor();

                const onPointerMove = (event: MouseEvent): void => {
                    const elements = Utils.elementsFromPoint(element.ownerDocument, event.clientX, event.clientY);

                    if (elements.some(el => el.classList.contains("toolbox") || el.classList.contains("editor"))) {
                        element.classList.add("no-pointer-events");
                    }
                    else {
                        element.classList.remove("no-pointer-events");
                    }
                };

                document.addEventListener("mousemove", onPointerMove, true);

                const css = ko.observable<string>("desktop");

                config.viewport.subscribe((viewport) => {
                    this.viewManager.mode = ViewManagerMode.selecting;

                    switch (viewport) {
                        case "zoomout":
                            css("viewport-zoomout");
                            this.viewManager.mode = ViewManagerMode.pause;
                            break;

                        case "xl":
                            css("viewport-xl");
                            break;

                        case "lg":
                            css("viewport-lg");
                            break;

                        case "md":
                            css("viewport-md");
                            break;

                        case "sm":
                            css("viewport-sm");
                            break;

                        case "xs":
                            css("viewport-xs");
                            break;

                        default:
                            throw new Error("Unknown viewport");
                    }
                });

                ko.applyBindingsToNode(element, { css: css });

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    document.removeEventListener("mousemove", onPointerMove);
                });
            },

            update: (element: HTMLElement, valueAccessor: any) => {
                this.layoutViewModel(null);

                if (this.documentViewModel) {
                    this.documentViewModel.dispose();
                }

                const config = valueAccessor();

                Array.prototype.slice.call(element.children).forEach(child => {
                    element.removeChild(child);
                });


                this.hostDocument = config.doc();

                if (this.hostDocument) {
                    const hostElement = this.createIFrame();
                    element.appendChild(hostElement);
                }
            }
        };
    }

    private createIFrame(): HTMLIFrameElement {
        const hostElement = document.createElement("iframe");
        hostElement.src = this.hostDocument.src;
        hostElement.classList.add("host");

        const onClick = (event: MouseEvent): void => {
            event.preventDefault(); // prevent default event handling for all controls
        };

        const onPointerDown = (event: MouseEvent): void => {
            // TODO: Move to GridEditor
            const htmlElement = <HTMLElement>event.target;
            const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

            if (!htmlLinkElement) {
                return;
            }

            if (!htmlLinkElement.closest("[contenteditable]")) {
                event.preventDefault();
            }

            if (event.ctrlKey) { // Preventing click on links if Ctrl key is not pressed.
                this.routeHandler.navigateTo(htmlLinkElement.href);
            }
        };

        const onLoad = (): void => {
            this.globalEventHandler.appendDocument(hostElement.contentDocument);
            this.setRootElement(hostElement.contentDocument.body);

            hostElement.contentDocument.addEventListener("click", onClick, true);
            hostElement.contentDocument.addEventListener("mousedown", onPointerDown, true);
        };

        hostElement.addEventListener("load", onLoad, false);

        // ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
        //     hostElement.removeEventListener("load", onLoad, false);
        //     hostElement.contentDocument.removeEventListener("click", onClick, true);
        //     hostElement.contentDocument.removeEventListener("mousedown", onPointerDown, true);
        // });

        return hostElement;
    }

    private documentViewModel;

    private async setRootElement(bodyElement: HTMLElement): Promise<void> {
        if (this.hostDocument.getLayoutViewModel) {
            const layoutViewModel = await this.hostDocument.getLayoutViewModel();
            this.layoutViewModel(layoutViewModel);
            ko.applyBindingsToNode(bodyElement, { if: this.layoutViewModel, widget: this.layoutViewModel, grid: {} });
        }
        else {
            const livingStyleGuide = bodyElement.querySelector("living-style-guide");
            ko.applyBindings({}, livingStyleGuide);
        }

        const styleElement = document.createElement("style");
        bodyElement.ownerDocument.head.appendChild(styleElement);
        ko.applyBindingsToNode(styleElement, { styleSheet: {} });
    }

    private async refreshContent(): Promise<void> {
        this.layoutViewModel(null);

        const layoutViewModel = await this.hostDocument.getLayoutViewModel();
        this.layoutViewModel(layoutViewModel);
    }

    private async onRouteChange(): Promise<void> {
        await this.refreshContent();
    }
}