import { SecurityModel } from "@paperbits/common/security";

export interface ISecurityModelEditor<T extends SecurityModel = SecurityModel> {
    securityModel: T;
    readonly onChange: (securityModel: T) => void;
}
