/**
 * Testimonials widget model.
 */
export class TestimonialsModel {
    /**
     * Testimonial text content.
     */
    public textContent: string;

    /**
     * Stars shown on the testimonial.
     */
    public starsCount: number;

    /**
     * Maximum stars allowed on the testimonial.
     */
    public allStarsCount: number;

    /**
     * Testimonial author.
     */
    public author: string;

    /**
     * Title of testimonial author, e.g. "CEO".
     */
    public authorTitle: string;
}
