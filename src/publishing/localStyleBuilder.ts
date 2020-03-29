import { StyleSheet } from "@paperbits/common/styles";
import { JssCompiler } from "@paperbits/styles/jssCompiler";
import * as Utils from "@paperbits/common/utils";
import { IBlobStorage } from "@paperbits/common/persistence";

export class LocalStyleBuilder {
    constructor(private readonly outputBlobStorage: IBlobStorage) { }

    public async buildGlobalStyle(styleSheet: StyleSheet): Promise<void> {
        const compiler = new JssCompiler();
        const css = compiler.compile(styleSheet);
        const contentBytes = Utils.stringToUnit8Array(css);

        await this.outputBlobStorage.uploadBlob("styles/styles.css", contentBytes, "text/css");
    }

    public async buildLocalStyle(permalink: string, styleSheets: StyleSheet[]): Promise<void> {
        let uploadUrl;

        if (permalink === "/") {
            uploadUrl = `/styles.css`;
        }
        else {
            uploadUrl = `${permalink}/styles.css`;
        }

        const compiler = new JssCompiler();
        const css = compiler.compile(...styleSheets);
        const contentBytes = Utils.stringToUnit8Array(css);

        await this.outputBlobStorage.uploadBlob(uploadUrl, contentBytes, "text/css");
    }
}