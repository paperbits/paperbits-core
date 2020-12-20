import { Contract } from "@paperbits/common";

export interface CarouselContract {
    type: string;
    styles?: any;
    carouselItems: CarouselItemContract[];
}

export interface CarouselItemContract extends Contract {
    styles?: any;
}