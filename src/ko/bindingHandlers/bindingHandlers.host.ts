import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { EventManager, GlobalEventHandler } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { Router, Route } from "@paperbits/common/routing";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { SiteService } from "@paperbits/common/sites";
import { IMediaService } from "@paperbits/common/media";

export class HostBindingHandler {
    private readonly hostComponent: ko.Observable<any>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly siteService: SiteService,
        private readonly mediaService: IMediaService
    ) {
        this.hostComponent = ko.observable();

        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: () => any) => {
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

                ko.applyBindingsToNode(element, { css: css }, null);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    document.removeEventListener("mousemove", onPointerMove);
                });

                const hostElement = this.createIFrame();
                element.appendChild(hostElement);
            },

            update: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();
                this.hostComponent(config.host());
            }
        };
    }

    private createIFrame(): HTMLIFrameElement {
        const hostElement: HTMLIFrameElement = document.createElement("iframe");
        hostElement.src = "/page.html?designtime=true";
        hostElement.classList.add("host");
        hostElement.title = "Website";

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

            if (event.ctrlKey || event.metaKey) { // Preventing click on links if Ctrl key is not pressed.
                this.router.navigateTo(htmlLinkElement.href);
            }
        };

        let hostedWindowHistory;

        const onRouteChange = (route: Route) => {
            route.metadata.originatedByHost = true;
            hostedWindowHistory.pushState(route, route.title, route.url);
        };

        const onLoad = async (): Promise<void> => {
            this.globalEventHandler.appendDocument(hostElement.contentDocument);
            this.setRootElement(hostElement.contentDocument.body);

            /* TODO: Move these events to grid designer code */
            hostElement.contentDocument.addEventListener("click", onClick, true);
            hostElement.contentDocument.addEventListener("mousedown", onPointerDown, true);

            this.viewManager["hostDocument"] = hostElement.contentDocument;

            /* intercepting push state of the hosted iframe window */
            hostedWindowHistory = hostElement.contentDocument.defaultView.window.history;
            const hostedWindowOriginalPushState = hostedWindowHistory.pushState;

            /* adding listener to designer's route handler */
            this.router.addRouteChangeListener(onRouteChange);

            /* pushing initial route to route handler of the hosted iframe window */
            const initialRoute = this.router.getCurrentRoute();
            hostedWindowHistory.pushState(initialRoute, initialRoute.title, location.href);

            /* overriding pushState method of the hosted iframe window */
            hostedWindowHistory.pushState = (route: Route, title: string, url: string) => {
                hostedWindowOriginalPushState.call(hostedWindowHistory, route, title, url);

                /* if event originated in the designer, skip pushing the state to avoid circular calls */
                if (route && route.metadata.originatedByHost) {
                    return;
                }

                /* synching the state with designer's window */
                window.history.pushState(route, route.title, route.url);
            };

            const settings = await this.siteService.getSiteSettings();

            if (!settings || !settings.site.faviconSourceKey) {
                return;
            }

            const mediaContract = await this.mediaService.getMediaByKey(settings.site.faviconSourceKey);

            if (!mediaContract || !mediaContract.permalink) {
                return;
            }

            MetaDataSetter.setFavIcon(mediaContract.permalink);
        };

        const onUnload = (): void => {
            /* removing listener when iframe gets unloaded */
            this.router.removeRouteChangeListener(onRouteChange);
        };

        hostElement.addEventListener("load", onLoad, false);
        hostElement.addEventListener("beforeunload", onUnload, false);



        return hostElement;
    }

    private async setRootElement(bodyElement: HTMLElement): Promise<void> {
        ko.applyBindingsToNode(bodyElement, { component: this.hostComponent }, null);

        const styleElement = document.createElement("style");
        bodyElement.ownerDocument.head.appendChild(styleElement);
        ko.applyBindingsToNode(styleElement, { styleSheet: {} }, null);
    }
}