import * as ko from "knockout";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { MapRuntimeConfig } from "./runtime/mapRuntimeConfig";
import { Events } from "@paperbits/common/events";


export class GooglmapsBindingHandler {
    constructor() {
        const attach = this.attach.bind(this);

        ko.bindingHandlers["googlemap"] = {
            init(element: HTMLElement, valueAccessor: () => MapRuntimeConfig): void {
                const configuration = valueAccessor();
                attach(element, ko.toJS(configuration));
            }
        };
    }

    private async attach(element: HTMLElement, configuration: MapRuntimeConfig): Promise<void> {
        const options: Partial<LoaderOptions> = {/* todo */ };
        const loader = new Loader({ apiKey: configuration.apiKey, ...options });
        await loader.load();

        const markerWidth = 50;
        const markerHeight = 50;
        const geocoder = new google.maps.Geocoder();
        const mapOptions: google.maps.MapOptions = {};
        const map = new google.maps.Map(element, mapOptions);

        if (!configuration.zoom) {
            configuration.zoom = 17;
        }
        else if (typeof configuration.zoom === "string") {
            configuration.zoom = parseInt(configuration.zoom);
        }

        map.setOptions({
            streetViewControl: false,
            mapTypeControl: false,
            scaleControl: true,
            rotateControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            draggable: false,
            disableDefaultUI: true,
            mapTypeId: configuration.mapType,
            zoom: configuration.zoom,
            styles: configuration.customizations
        });

        const locationToPosition = async (location: string): Promise<google.maps.LatLng> => {
            const request: google.maps.GeocoderRequest = {};
            const coordinates = new RegExp("(-?\\d+\(?:.\\d+)?),(-?\\d+\(?:.\\d+)?)").exec(location);

            if (coordinates) {
                request.location = {
                    lat: <any>coordinates[1] * 1,
                    lng: <any>coordinates[2] * 1,
                };
            }
            else {
                request.address = location;
            }

            return new Promise<google.maps.LatLng>((resolve, reject) => {
                geocoder.geocode(request, (results: google.maps.GeocoderResult[], status) => {
                    const position = results[0].geometry.location;

                    if (status === google.maps.GeocoderStatus.OK) {
                        resolve(position);
                    }

                    reject(`Could not geocode specified location: "${location}".`);
                });
            });
        };

        class PopupAnchor extends google.maps.OverlayView {
            private readonly content: HTMLElement;

            constructor(private readonly position: google.maps.LatLng) {
                super();
                this.content = document.createElement("div");
            }

            /** Called when the popup is added to the map. */
            public onAdd(): void {
                PopupAnchor.preventMapHitsAndGesturesFrom(this.content);

                this.content.setAttribute("data-toggle", "popup");
                this.content.setAttribute("data-target", `#${configuration.markerPopupKey.replace("popups/", "popups")}`);
                this.content.setAttribute("data-position", "top");

                this.getPanes().floatPane.appendChild(this.content);
                document.dispatchEvent(new CustomEvent("onPopupRequested", { detail: configuration.markerPopupKey }));
            }

            /** Called each frame when the popup needs to draw itself. */
            public draw(): void {
                const elementPosition = this.getProjection().fromLatLngToDivPixel(this.position);

                this.content.style.left = elementPosition.x - Math.floor(markerWidth / 2) + "px";
                this.content.style.top = elementPosition.y - Math.floor(markerHeight / 2) + "px";
                this.content.style.width = markerWidth + "px";
                this.content.style.height = markerHeight + "px";

                document.dispatchEvent(new CustomEvent("onPopupRepositionRequested", {
                    detail: {
                        element: this.content,
                        placement: "top"
                        // offsetX:
                        // offsetY:
                    }
                }));
            }
        }

        const position = await locationToPosition(configuration.location);

        const marker: google.maps.Marker = new google.maps.Marker();
        marker.setMap(map);

        if (configuration.markerIcon) {
            const icon: google.maps.Icon = {
                url: configuration.markerIcon,
                scaledSize: new google.maps.Size(markerWidth, markerHeight)
            };

            marker.setIcon(icon);
        }

        marker.setPosition(position);
        map.setCenter(position);

        if (configuration.markerPopupKey) {
            const anchor = new PopupAnchor(position);
            anchor.setMap(map);

            marker.addListener(Events.Click, () => document.dispatchEvent(new CustomEvent("onPopupRequested", { detail: configuration.markerPopupKey })));
        }
        else {
            const infowindow = new google.maps.InfoWindow();
            infowindow.setContent(configuration.caption);

            if (configuration.caption.length > 0) {
                infowindow.open(map, marker);
            }
            else {
                infowindow.close();
            }
        }
    }
}

