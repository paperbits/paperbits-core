import * as ko from "knockout";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { MapRuntimeConfig } from "./runtime/mapRuntimeConfig";


export class GooglmapsBindingHandler {
    constructor() {
        const attach = this.attach.bind(this);

        ko.bindingHandlers["googlemap"] = {
            init(element: Element, valueAccessor: () => MapRuntimeConfig): void {
                const configuration = valueAccessor();
                attach(element, ko.toJS(configuration));
            }
        };
    }

    private async attach(element: Element, configuration: MapRuntimeConfig): Promise<void> {
        const options: Partial<LoaderOptions> = {/* todo */ };
        const loader = new Loader({ apiKey: configuration.apiKey, ...options });
        await loader.load();

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
            zoom: configuration.zoom
        });

        const marker = new google.maps.Marker();
        marker.setMap(map);

        if (configuration.markerIcon) {
            const icon: google.maps.Icon = {
                url: configuration.markerIcon,
                scaledSize: new google.maps.Size(50, 50)
            };

            marker.setIcon(icon);
        }

        const setLocation = (location: string) => {
            const request: google.maps.GeocoderRequest = {};
            const coordinates = new RegExp("(-?\\d+\(?:.\\d+)?),(-?\\d+\(?:.\\d+)?)").exec(location);

            if (coordinates) {
                request.location = {
                    lat: <any>coordinates[1] * 1,
                    lng: <any>coordinates[2] * 1,
                };
            } else {
                request.address = location;
            }

            geocoder.geocode(request, (results: google.maps.GeocoderResult[], status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    marker.setPosition(results[0].geometry.location);
                    map.setCenter(results[0].geometry.location);
                }
            });
        };

        const infowindow = new google.maps.InfoWindow();
        const setCaption = (caption: string) => {
            infowindow.setContent(caption);

            if (caption && caption.length > 0) {
                infowindow.open(map, marker);
            }
            else {
                infowindow.close();
            }
        };

        setLocation(configuration.location);
        setCaption(configuration.caption);
    }
}

