import * as ko from "knockout";
import { BuiltInRoles, UserService } from "@paperbits/common/user";
import { EventManager } from "@paperbits/common/events";


export class SecuredBindingHandler {
    constructor(
        private readonly eventManager: EventManager,
        private readonly userService: UserService
    ) {
        const hiddenObservable: ko.Observable<boolean> = ko.observable(true);
        const dataRoleObservable: ko.Observable<string> = ko.observable();

        let widgetRoles: string[] = [];

        const applyRoles = async () => {
            const userRoles = await this.userService.getUserRoles();
            const visibleToUser = userRoles.some(x => widgetRoles.includes(x)) || widgetRoles.includes(BuiltInRoles.everyone.key);
            hiddenObservable(!visibleToUser);

            const roles = widgetRoles
                && widgetRoles.length === 1
                && widgetRoles[0] === BuiltInRoles.everyone.key
                ? null
                : widgetRoles.join(",");
            dataRoleObservable(roles);
        };

        ko.bindingHandlers["secured"] = {
            init: (element: HTMLElement, valueAccessor: () => string[]) => {
                widgetRoles = ko.unwrap(valueAccessor()) || [BuiltInRoles.everyone.key];

                this.eventManager.addEventListener("onUserRoleChange", applyRoles);

                ko.applyBindingsToNode(element, {
                    attr: { "data-role": dataRoleObservable },
                    css: { hidden: hiddenObservable }
                }, null);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    this.eventManager.removeEventListener("onUserRoleChange", applyRoles);
                });
            },

            update: (element: HTMLElement, valueAccessor: () => string[]) => {
                widgetRoles = ko.unwrap(valueAccessor()) || [BuiltInRoles.everyone.key];
                applyRoles();
            }
        };
    }
}