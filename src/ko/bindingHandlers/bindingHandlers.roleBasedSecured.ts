import * as ko from "knockout";
import { UserService } from "@paperbits/common/user";
import { EventManager } from "@paperbits/common/events";
import { RoleBasedSecurityModel } from "@paperbits/common/security/roleBasedSecurityModel";
import { RoleBasedSecuredBehavior, RoleBasedSecuredBehaviorConfig } from "@paperbits/common/behaviors/behavior.roleBasedSecured";


export class RoleBasedSecuredBindingHandler {
    constructor(
        private readonly eventManager: EventManager,
        private readonly userService: UserService
    ) {
        ko.bindingHandlers["secured"] = {
            init: (element: HTMLElement, valueAccessor: () => ko.Observable<RoleBasedSecurityModel> | RoleBasedSecurityModel) => {
                const securityModelObservableOrStatic = valueAccessor();
                const initialSecurityModel = ko.unwrap(securityModelObservableOrStatic);

                const dataRoleObservable: ko.Observable<string | null> = ko.observable(null);
                const hiddenObservable: ko.Observable<boolean> = ko.observable(false);

                const behaviorConfig: RoleBasedSecuredBehaviorConfig = {
                    initialSecurityModel: initialSecurityModel,
                    userService: this.userService,
                    eventManager: this.eventManager,
                    onUpdate: (roles, isHidden) => {
                        dataRoleObservable(roles);
                        hiddenObservable(isHidden);
                    }
                };

                const behaviorHandle = RoleBasedSecuredBehavior.attach(element, behaviorConfig);

                ko.applyBindingsToNode(element, {
                    attr: { "data-role": dataRoleObservable },
                    css: { hidden: hiddenObservable }
                }, null);

                let subscription: ko.Subscription | undefined;
                if (ko.isObservable(securityModelObservableOrStatic)) {
                    subscription = securityModelObservableOrStatic.subscribe((newModel) => {
                        behaviorHandle.update && behaviorHandle.update(newModel);
                    });
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    if (subscription) {
                        subscription.dispose();
                    }
                    if (behaviorHandle && behaviorHandle.detach) {
                        behaviorHandle.detach();
                    }
                });
            }
        };
    }
}