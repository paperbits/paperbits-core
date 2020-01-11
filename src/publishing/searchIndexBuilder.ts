import * as lunr from "lunr";
import * as h2p from "html2plaintext";

interface SearchableDocument {
    permalink: string;
    title: string;
    description: string;
    body: string;
}

const indexerConfig = function (documents: SearchableDocument[]): lunr.ConfigFunction {
    return function (): void {
        this.ref("permalink");
        this.field("title");
        this.field("description");
        this.field("body");

        documents.forEach(document => this.add(document), this);
    };
};

export class SearchIndexBuilder {
    private documents: any[];

    constructor() {
        this.documents = [];
    }

    public appendPage(permalink: string, title: string, description: string, body: string): void {
        const regex = /<main.*>([\s\S]*)<\/main>/g;
        const match = regex.exec(body);

        if (match?.length < 1) {
            return;
        }

        const mainContent = match[1];

        this.documents.push({
            permalink: permalink,
            title: title,
            description: description,
            body: h2p(mainContent)
        });
    }

    public buildIndex(): string {
        const index = lunr(indexerConfig(this.documents));
        return JSON.stringify(index);
    }
}