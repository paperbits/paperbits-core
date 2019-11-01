import * as ko from "knockout";
import { BuiltInRoles, UserService } from "@paperbits/common/user";
import { EventManager } from "@paperbits/common/events";


export class SecuredBindingHandler {
    constructor(
        private readonly eventManager: EventManager,
        private readonly userService: UserService
    ) {
        ko.bindingHandlers["secured"] = {
            update: (element: HTMLElement, valueAccessor: () => string[]) => {
                const hiddenObservable: ko.Observable < boolean > = ko.observable(true);
                const dataRoleObservable: ko.Observable<string> = ko.observable();

                const applyRoles = async () => {
                    const widgetRoles = ko.unwrap(valueAccessor()) || [BuiltInRoles.everyone.key];
                    const userRoles = await this.userService.getUserRoles();
                    const visibleToUser = userRoles.some(x => widgetRoles.includes(x)) || widgetRoles.includes(BuiltInRoles.everyone.key);
                    

                    const roles = widgetRoles
                        && widgetRoles.length === 1
                        && widgetRoles[0] === BuiltInRoles.everyone.key
                        ? null
                        : widgetRoles.join(",");

                    dataRoleObservable(roles);
                    hiddenObservable(!visibleToUser);
                };

                this.eventManager.addEventListener("onUserRoleChange", applyRoles);

                ko.applyBindingsToNode(element, {
                    attr: { "data-role": dataRoleObservable },
                    css: { hidden: hiddenObservable }
                }, null);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    this.eventManager.removeEventListener("onUserRoleChange", applyRoles);
                });

                applyRoles();
            }
        };
    }
}