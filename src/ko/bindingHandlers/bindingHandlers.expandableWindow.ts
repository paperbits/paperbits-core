import { IComponent, View, ViewManager } from "@paperbits/common/ui";
import * as ko from "knockout";

export interface ExpandableWindowOption {
    component?: IComponent;
    // isExpanded?: boolean;
    // isExpand: ko.Observable<boolean>;
}

export class ExpandableWindowHandler {
    constructor( viewManager: ViewManager) {
        ko.bindingHandlers["expandableWindow"] = {
            init(element: HTMLElement, valueAccessor: () => ExpandableWindowOption) {
                let config = valueAccessor();
                console.log(config)
                let balloonHandler;
                const view: View = {
                    heading: "Expanded",
                    component: config.component,
                    resize: "vertically horizontally"
                }
                // const onExpand = (isExpand: boolean) => {
                //     console.log(isExpand)
                // }
                ko.applyBindingsToNode(element, {
                    balloon: {
                        component: config.component,
                        onCreated: (handle) => {
                            balloonHandler = handle;
                        }
                    }
                }, null);

                const onExpand = (isExpand: boolean) => {
                    console.log("ABC")
                    if (isExpand) {
                        balloonHandler.close()
                        viewManager.openViewAsPopup(view);
                    } 
                    else {
                        viewManager.closeView();
                        balloonHandler.open(element);
                    }
                }
                config.component.params["onExpand"] = onExpand;

                // setInterval(() => {
                //     console.log(isExpand());
                // }, 2000)
                // isExpand.subscribe(changeView);

                // if (config.isExpanded) {
                //     ko.applyBindingsToNode(element, {
                //         balloon: {
                //             component: config.component,
                //             onCreated: (handle) => {
                //                 setInterval(() => {
                //                     handle.close()
                //                 }, 2000);
                //                 setTimeout(() => {
                //                     setInterval(() => {
                //                         handle.open(element)
                //                     }, 2000)
                //                 }, 1000)
                //             }
                //         }
                //     }, null);
                // }
                // else {
                //     ko.applyBindingsToNode(element, {
                //         click: () => {
                //             viewManager.openViewAsPopup(view);
                //         }
                //     }, null)
                // }

                // const changeView = (isExpanded: boolean) => {
                //     if (isExpanded) {

                //     } 
                //     else {
                //         viewManager.closeView();
                //     }
                // }
                // this.config.isExpanded.subscribe(changeView);
            }
        };
    }
}