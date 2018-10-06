export function Event(name?: string): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        let props: string[] = Reflect.getMetadata("events", target.constructor);

        if (!props) {
            props = [];
        }

        props.push(propertyKey);

        Reflect.defineMetadata("events", props, target.constructor);
    };
}