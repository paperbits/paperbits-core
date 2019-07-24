export class SitemapBuilder {
    private readonly permalinks: string[];
    private readonly baseUrl: string;

    constructor(private readonly hostname: string = "") {
        this.permalinks = [];
        this.baseUrl = hostname ? `https://${this.hostname}` : "";
    }

    public appendPermalink(permalink: string): void {
        this.permalinks.push(permalink);
    }

    public buildSitemap(): string {
        const now = new Date();
        const dateTimeISO = now.toISOString();
        const urls = this.permalinks.map(permalink =>
            `<url><loc>${this.baseUrl}${permalink}</loc><lastmod>${dateTimeISO}</lastmod><changefreq>daily</changefreq></url>`
        ).join("");

        return `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">${urls}</urlset>`;
    }
}