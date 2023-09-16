import * as ko from "knockout";
import { EventManager, Events, GlobalEventHandler } from "@paperbits/common/events";
import { IComponent, ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { Router, Route } from "@paperbits/common/routing";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { SiteService, SiteSettingsContract } from "@paperbits/common/sites";
import { IMediaService } from "@paperbits/common/media";

interface HostConfig {
    viewport: ko.Observable<string>;
    block: ko.Observable<boolean>;
    host: ko.Observable<IComponent>;
    onDocumentCreated: (document: Document) => void;
    onDocumentDisposed: () => void;
}


export class HostBindingHandler {
    private readonly hostComponent: ko.Observable<any>;
    private readonly designTime: ko.Observable<boolean>;
    private onDocumentCreated: (document: Document) => void;
    private onDocumentDisposed: () => void;

    constructor(
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly siteService: SiteService,
        private readonly mediaService: IMediaService
    ) {
        this.hostComponent = ko.observable();
        this.designTime = ko.observable(true);

        const css = ko.observable<string>();

        const getCssForViewport = (viewport: string): string => {
            switch (viewport) {
                case "zoomout":
                    return "viewport-zoomout";
                    this.viewManager.mode = ViewManagerMode.pause;
                    break;
                case "xl":
                    return "viewport-xl";
                case "lg":
                    return "viewport-lg";
                case "md":
                    return "viewport-md";
                case "sm":
                    return "viewport-sm";
                case "xs":
                    return "viewport-xs";
                default:
                    throw new Error("Unknown viewport");
            }
        }

        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: () => HostConfig) => {
                const config = valueAccessor();

                config.block.subscribe(this.designTime);

                config.viewport.subscribe((viewport: string) => {
                    if (config.host().name == "style-guide") {
                        css("viewport-xl");
                        return;
                    }

                    this.viewManager.mode = ViewManagerMode.selecting;
                    const className = getCssForViewport(viewport);
                    css(className);
                });

                this.onDocumentCreated = config.onDocumentCreated;
                this.onDocumentDisposed = config.onDocumentDisposed;

                ko.applyBindingsToNode(element, { css: css }, null);

                const hostElement = this.createIFrame();
                element.appendChild(hostElement);
            },

            update: (element: HTMLElement, valueAccessor: () => HostConfig) => {
                const config = valueAccessor();
                this.hostComponent(config.host());

                if (config.host().name == "style-guide") {
                    css("viewport-xl");
                    return;
                }
                else {
                    const config = valueAccessor();
                    const className = getCssForViewport(config.viewport());
                    css(className);
                }
            }
        };
    }


    private createIFrame(): HTMLIFrameElement {
        const hostElement: HTMLIFrameElement = document.createElement("iframe");
        hostElement.src = "/page.html?designtime=true";
        hostElement.classList.add("host");
        hostElement.title = "Website";
        hostElement.tabIndex = -1;
        hostElement.setAttribute("aria-hidden", "true");

        let hostedWindowHistory;

        const onRouteChange = (route: Route): void => {
            route.metadata.originatedByHost = true;
            hostedWindowHistory.pushState(route, route.title, route.url);
        };

        const onLoad = async (): Promise<void> => {
            const contentDocument = hostElement.contentDocument;

            if (this.onDocumentCreated) {
                this.onDocumentCreated(contentDocument);
            }

            this.globalEventHandler.appendDocument(contentDocument);
            this.setRootElement(contentDocument.body);

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

            const settings = await this.siteService.getSettings<any>();
            const siteSettings: SiteSettingsContract = settings?.site;

            if (!siteSettings?.faviconSourceKey) {
                return;
            }

            const mediaContract = await this.mediaService.getMediaByKey(siteSettings.faviconSourceKey);

            if (!mediaContract || !mediaContract.permalink) {
                return;
            }

            MetaDataSetter.setFavIcon(mediaContract.permalink);
        };

        const onUnload = (): void => {
            /* removing listener when iframe gets unloaded */
            this.router.removeRouteChangeListener(onRouteChange);

            if (this.onDocumentDisposed) {
                this.onDocumentDisposed();
            }
        };

        hostElement.addEventListener("load", onLoad, false);
        hostElement.addEventListener("beforeunload", onUnload, false);

        return hostElement;
    }

    private setRootElement(bodyElement: HTMLElement): void {
        const styleElement = document.createElement("style");
        bodyElement.ownerDocument.head.appendChild(styleElement);

        ko.applyBindingsToNode(bodyElement, { css: { design: this.designTime } }, null);
        ko.applyBindingsToNode(styleElement, { styleSheet: {} }, null);
        ko.applyBindingsToNode(bodyElement, { component: this.hostComponent }, null);
    }
}