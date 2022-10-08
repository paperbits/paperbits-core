import * as ko from "knockout";
import { ComponentBinder } from "@paperbits/common/editing";


export class KnockoutComponentBinder implements ComponentBinder {
    public async bind(element: Element, componentDefinition: unknown, componentParams: unknown): Promise<void> {
        const registration = Reflect.getMetadata("paperbits-component", componentDefinition);

        if (!registration) {
            throw new Error(`Could not find component registration for view model.`);
        }

        ko.applyBindingsToNode(element, { component: { name: registration.name, params: componentParams } }, null);
    }

    public async unbind(element: Element): Promise<void> {
        // TODO
    }
}