import { IIntercomLead } from "../intercom/IIntercomLead";
import { IIntercomService } from "./IIntercomService";
import { ISettingsProvider } from "@paperbits/common/configuration";

export class IntercomService implements IIntercomService {
    private readonly settingsProvider: ISettingsProvider;

    constructor(settingsProvider: ISettingsProvider) {
        this.settingsProvider = settingsProvider;

        this.boot = this.boot.bind(this);
        this.loadConfig = this.loadConfig.bind(this);

        this.loadConfig();
    }

    private async loadConfig(): Promise<void> {
        const intercomSetting = await this.settingsProvider.getSetting("intercom");
        this.boot(intercomSetting["appId"], intercomSetting["settings"]);
    }

    private boot(appId: string, intercomSettings: Object) {
        if (typeof window["Intercom"] === "function") {
            window["Intercom"]("reattach_activator");
            window["Intercom"]("update", intercomSettings);
        }
        else {
            const intercomHandle = function () {
                intercomHandle["c"](arguments);
            };
            intercomHandle["q"] = [];
            intercomHandle["c"] = function (args) {
                intercomHandle["q"].push(args);
            };

            const scriptElement = window.document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.async = true;
            scriptElement.src = `https://widget.intercom.io/widget/${appId}`;
            const x = window.document.getElementsByTagName("body")[0];
            x.appendChild(scriptElement);

            window["Intercom"] = intercomHandle;

            window["Intercom"]("boot", {
                app_id: appId
            });
        }
    }

    public update(data: IIntercomLead): void {
        window["Intercom"]("update", data);
    }
}
