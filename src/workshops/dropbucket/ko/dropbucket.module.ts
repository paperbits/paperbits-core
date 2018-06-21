import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DropBucket } from "./dropbucket";

export class DropbucketModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("dropbucket", DropBucket);
    }
}