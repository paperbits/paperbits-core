import { Contract } from "@paperbits/common/contract";

/**
 * Testimonials widget data contract.
 */
export interface TestimonialsContract extends Contract {
    /**
     * Testimonial text content.
     */
    textContent: string;

    /**
     * Stars shown on the testimonial.
     */
    starsCount: number;

    /**
     * Maximum stars allowed on the testimonial.
     */
    allStarsCount: number;

    /**
     * Testimonial author.
     */
    author: string;

    /**
     * Title of testimonial author, e.g. "CEO".
     */
    authorTitle: string;
}