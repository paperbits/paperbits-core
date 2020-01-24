/**
 * Entity describing searchable document.
 */
export interface SearchableDocument {
    /**
     * Document location.
     */
    permalink: string;

    /**
     * Document title, e.g. "About".
     */
    title: string;

    /**
     * Document description.
     */
    description: string;

    /**
     * Document content.
     */
    body: string;
}
