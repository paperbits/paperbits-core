import * as ko from "knockout";
import template from "./gtm.html";
import { GoogleTagManagerConfig } from "@paperbits/common/sites";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-gtm",
    template: template
})
export class GoogleTagManager {
    public static gtmDataLayerName = "dataLayer";
    public gtmBootstrapper: ko.Observable<string>;

    constructor(private readonly settingsProvider: ISettingsProvider) {
        this.initialize = this.initialize.bind(this);
        this.gtmBootstrapper = ko.observable<string>();
    }

    @OnMounted()
    private async initialize(): Promise<void> {
        const config: any = await this.settingsProvider.getSettings();

        if (!config || !config.gtm) {
            return;
        }

        this.boot(config.gtm);
    }

    private boot(gtm: GoogleTagManagerConfig): void {
        if (gtm.containerId === null) {
            return;
        }

        if (!gtm.dataLayerName) {
            gtm.dataLayerName = "dataLayer";
        }

        const bootstrapper = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});let f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','" + gtm.dataLayerName + "','" + gtm.containerId + "');</script><noscript><iframe src='http://www.googletagmanager.com/ns.html?id=" + gtm.containerId + "'  height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>";

        this.gtmBootstrapper(bootstrapper);
    }
}