import * as ko from "knockout";
import { EventManager, Events, GlobalEventHandler } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { Router, Route } from "@paperbits/common/routing";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { SiteService, SiteSettingsContract } from "@paperbits/common/sites";
import { IMediaService } from "@paperbits/common/media";


export class HostBindingHandler {
    private readonly hostComponent: ko.Observable<any>;
    private readonly designTime: ko.Observable<boolean>;

    constructor(
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly siteService: SiteService,
        private readonly mediaService: IMediaService,
        private readonly eventManager: EventManager
    ) {
        this.hostComponent = ko.observable();
        this.designTime = ko.observable(true);

        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: () => any) => {
                const config = valueAccessor();
                const css = ko.observable<string>("desktop");

                config.block.subscribe(this.designTime);

                config.viewport.subscribe((viewport: string) => {
                    this.viewManager.mode = ViewManagerMode.selecting;

                    if (this.hostComponent()?.name === "style-guide") {
                        css("viewport-xl");
                        this.eventManager.dispatchEvent("onViewportChange");
                        return;
                    }

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

                const hostElement = this.createIFrame();
                element.appendChild(hostElement);


            },

            update: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();
                this.hostComponent(config.host());
            }
        };
    }

    private fillDocument(document: Document): void {
        const charsetTag = document.createElement("meta");
        charsetTag.setAttribute("charset", "utf-8");
        document.head.appendChild(charsetTag);

        const viewportTag = document.createElement("meta");
        viewportTag.setAttribute("name", "viewport");
        viewportTag.setAttribute("content", "width=device-width,minimum-scale=1,initial-scale=1");
        document.head.appendChild(viewportTag);

        const faviconLink = document.createElement("link");
        faviconLink.setAttribute("href", "favicon.ico");
        faviconLink.setAttribute("rel", "shortcut icon");
        document.head.appendChild(faviconLink);

        const stylesLink = document.createElement("link");
        stylesLink.setAttribute("href", "/styles/theme.css");
        stylesLink.setAttribute("rel", "stylesheet");
        stylesLink.setAttribute("type", "text/css");
        document.head.appendChild(stylesLink);

        const sctiptTag = document.createElement("script");
        sctiptTag.setAttribute("href", "/scripts/theme.js");
        sctiptTag.setAttribute("type", "text/javascript");

        document.head.appendChild(sctiptTag);
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

            // this.fillDocument(contentDocument);

            this.viewManager["hostDocument"] = contentDocument;
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