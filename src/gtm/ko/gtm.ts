import * as ko from "knockout";
import template from "./gtm.html";
import { IGtmConfig } from "@paperbits/common/sites/ISettings";
import { ISettingsProvider } from '@paperbits/common/configuration/ISettingsProvider';
import { Component } from "@paperbits/knockout/decorators";
   
@Component({
    selector: "paperbits-gtm",
    template: template,
    injectable: "gtm"
})
export class GoogleTagManager {
    static gtmDataLayerName = 'dataLayer';
    public gtmBootstrapper: KnockoutObservable<string>;

    constructor(settingsProvider: ISettingsProvider) {
        this.boot = this.boot.bind(this);
        this.onConfigLoaded = this.onConfigLoaded.bind(this);

        settingsProvider.getSettings().then(this.onConfigLoaded);
        this.gtmBootstrapper = ko.observable<string>();
    }

    private onConfigLoaded(config: any): void {
        if (!config || !config.gtm) {
            return;
        }

        this.boot(config.gtm);
    }

    private boot(gtm: IGtmConfig): void {
        if (gtm.containerId == null){
            return;
        }
        
        if (!gtm.dataLayerName) {
            gtm.dataLayerName = 'dataLayer'
        }

        let bootstrapper = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','" + gtm.dataLayerName + "','" + gtm.containerId + "');</script><noscript><iframe src='http://www.googletagmanager.com/ns.html?id=" + gtm.containerId + "'  height='0' width='0' style='display:none;visibility:hidden'></iframe> </noscript>";

        this.gtmBootstrapper(bootstrapper);
    }
}