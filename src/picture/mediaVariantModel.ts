/**
 * Variant of the media for different screen sizes.
 */
export class MediaVariantModel {
    /**
     * A key that is used to identify a file in blob.
     */
    public blobKey?: string;

    /**
     * Width in pixels.
     */
    public width?: number;

    /**
     * Height in pixels.
     */
    public height?: number;

    /**
     * Mime type, e.g. `image/png`.
     */
    public mimeType?: string;

    /**
     * Download URL. If available, can be used for direct download.
     */
    public downloadUrl?: string;
}
