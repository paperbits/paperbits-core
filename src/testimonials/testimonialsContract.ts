import { Contract } from "@paperbits/common/contract";

export interface TestimonialsContract extends Contract {
    textContent: string;
    starsCount: number;
    allStarsCount: number;
    author: string;
    authorTitle: string;
}