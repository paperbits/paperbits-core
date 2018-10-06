// import * as GoogleMapsLoader from "google-maps";
import { ISettingsProvider, Settings } from "@paperbits/common/configuration";

export class MapService {
    constructor(
        private readonly settingsProvider: ISettingsProvider
    ) { }

    public async loadGoogleMaps(): Promise<void> {
        const config = await this.settingsProvider.getSetting(Settings.Config.GMaps);

        await this.load(config["apiKey"]);

        this.settingsProvider.onSettingChange(Settings.Config.GMaps, config => {
            // GoogleMapsLoader.release(() => { this.load(config["apiKey"]); });
        });
    }

    private async load(apiKey: string): Promise<void> {
        return new Promise<void>(resolve => {
            // (<any>GoogleMapsLoader).KEY = apiKey;

            // GoogleMapsLoader.load((google) => {
            //     resolve();
            // });
        });
    }
}