import { Contract } from "@paperbits/common";
import { SecurityContract } from "@paperbits/common/security";
import { LocalStyles } from "@paperbits/common/styles";

export interface SectionContract extends Contract {
    /**
     * Section local styles.
     */
    styles?: LocalStyles;

    /**
     * Security settings.
     */
     security?: SecurityContract;
}