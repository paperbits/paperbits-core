import { SecurityModel } from "@paperbits/common/security";

export interface SecurityModelEditor<T extends SecurityModel = SecurityModel> {
    securityModel: T;
    readonly onChange: (securityModel: T) => void;
}
