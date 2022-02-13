import * as ko from "knockout";
import { BuiltInRoles, UserService } from "@paperbits/common/user";
import { EventManager } from "@paperbits/common/events";


export class SecuredBindingHandler {
    constructor(
        private readonly eventManager: EventManager,
        private readonly userService: UserService
    ) {
        ko.bindingHandlers["secured"] = {
            init: (element: HTMLElement, valueAccessor: any) => {
                const initiallyAssignedRoles = ko.unwrap(valueAccessor());
                const dataRoleObservable: ko.Observable<string> = ko.observable(initiallyAssignedRoles);
                const hiddenObservable: ko.Observable<boolean> = ko.observable(false);

                const applyRoles = (assignedRoles: string[]) => { // has to be synchronous to be applied during publishing
                    const widgetRoles = assignedRoles || [BuiltInRoles.everyone.key];

                    const roles = widgetRoles
                        && widgetRoles.length === 1
                        && widgetRoles[0] === BuiltInRoles.everyone.key
                        ? null
                        : widgetRoles.join(",");

                    dataRoleObservable(roles);
                    applyVisibility();
                };

                const applyVisibility = async () => { // doesn't have to be synchronous, used in design- and run-time only
                    const widgetRolesString = dataRoleObservable();
                    const widgetRoles = !!widgetRolesString ? widgetRolesString.split(",") : [BuiltInRoles.everyone.key];
                    const userRoles = await this.userService.getUserRoles();
                    const visibleToUser = userRoles.some(x => widgetRoles.includes(x)) || widgetRoles.includes(BuiltInRoles.everyone.key);
                    
                    hiddenObservable(!visibleToUser);
                };

                this.eventManager.addEventListener("onUserRoleChange", applyVisibility);

                ko.applyBindingsToNode(element, {
                    attr: { "data-role": dataRoleObservable },
                    css: { hidden: hiddenObservable }
                }, null);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    this.eventManager.removeEventListener("onUserRoleChange", applyVisibility);
                });

                const assignedRolesObsevable: ko.Observable<string[]> = valueAccessor();
                assignedRolesObsevable.subscribe(applyRoles);
                applyRoles(initiallyAssignedRoles);
            }
        };
    }
}