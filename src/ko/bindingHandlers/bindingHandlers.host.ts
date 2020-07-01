import * as ko from "knockout";
import { GlobalEventHandler } from "@paperbits/common/events";
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
        private readonly mediaService: IMediaService
    ) {
        this.hostComponent = ko.observable();
        this.designTime = ko.observable(true);


        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: () => any) => {
                const config = valueAccessor();
                const css = ko.observable<string>("desktop");

                config.block.subscribe(this.designTime);

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
            if (!event.ctrlKey && !event.metaKey && (this.viewManager.mode !== ViewManagerMode.preview)) {
                return;
            }

            const htmlElement = <HTMLElement>event.target;
            const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

            if (!htmlLinkElement) {
                return;
            }

            event.preventDefault();

            this.router.navigateTo(htmlLinkElement.href);
        };

        let hostedWindowHistory;

        const onRouteChange = (route: Route): void => {
            route.metadata.originatedByHost = true;
            hostedWindowHistory.pushState(route, route.title, route.url);
        };

        const onLoad = async (): Promise<void> => {
            const contentDocument = hostElement.contentDocument;

            this.globalEventHandler.appendDocument(contentDocument);
            this.setRootElement(contentDocument.body);

            /* TODO: Move these events to grid designer code */
            contentDocument.addEventListener("mousedown", onPointerDown, true);
            contentDocument.addEventListener("click", onClick, true);

            this.viewManager["hostDocument"] = contentDocument;

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

            const settings =  await this.siteService.getSettings<any>();
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

    private async setRootElement(bodyElement: HTMLElement): Promise<void> {
        const styleElement = document.createElement("style");
        bodyElement.ownerDocument.head.appendChild(styleElement);

        ko.applyBindingsToNode(bodyElement, { css: { design: this.designTime } }, null);
        ko.applyBindingsToNode(styleElement, { styleSheet: {} }, null);
        ko.applyBindingsToNode(bodyElement, { component: this.hostComponent }, null);
    }
}