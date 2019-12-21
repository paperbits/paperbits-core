import { Contract } from "@paperbits/common";

export interface MapContract extends Contract {
    /**
     * 
     */
    location: string;


    /**
     * 
     */
    layout?: string;

    /**
     * Pin caption.
     */
    caption?: string;

    /**
     * Indicates, whether zoom controls need to be displayed.
     */
    zoomControl?: string;
}