/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */

import { ISettingsProvider } from "@paperbits/common/configuration/ISettingsProvider";


export class StaticSettingsProvider implements ISettingsProvider {
    private readonly configuration: Object;

    constructor(config: Object) {
        const tenants = Object.keys(config);
        const tenantHostname = tenants[0];

        if (tenants.length > 1) {
            console.log(`Multiple tenants defined in config.json. Taking the first one "${tenantHostname}..."`);
        }

        this.configuration = config[tenantHostname];
    }

    public getSetting(name: string): Promise<Object> {
        return this.configuration[name];
    }

    public setSetting(name: string, value: Object): void {
        this.configuration[name] = value;
    }

    public async getSettings(): Promise<Object> {
        return this.configuration;
    }
}