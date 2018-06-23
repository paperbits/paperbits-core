/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import { IRouteHandler } from "@paperbits/common/routing";
import { IEventManager } from "@paperbits/common/events";


export class StaticRouteHandler implements IRouteHandler {
    private currentUrl: string;
    private callbacks: any[];

    constructor() {
        this.currentUrl = "/";
        this.navigateTo = this.navigateTo.bind(this);
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        this.callbacks = [];
    }

    public addRouteChangeListener(callback: () => void): void {
        //this.callbacks.push(callback);
    }

    public removeRouteChangeListener(callback: () => void): void {
        // this.callbacks.spliceremove(callback);
    }

    public navigateTo(hash: string, notifyListeners: boolean = true, forceNotification?: boolean): void {
        this.currentUrl = hash;

        this.callbacks.forEach(callback => {
            callback();
        });
    }

    public getCurrentUrl(): string {
        return this.currentUrl;
    }
}