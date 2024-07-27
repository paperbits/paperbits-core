import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";
import * as Utils from "@paperbits/common/utils";
import { IPublisher } from "@paperbits/common/publishing";
import { IBlobStorage } from "@paperbits/common/persistence";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { Logger } from "@paperbits/common/logging";


const assetsBaseBath = path.resolve(__dirname, "./assets");

export class AssetPublisher implements IPublisher {
    constructor(
        private readonly outputBlobStorage: IBlobStorage,
        private readonly settingsProvider: ISettingsProvider,
        private readonly logger: Logger
    ) { }

    private async copyAssetFrom(assetPath: string, suffix: string): Promise<void> {
        try {
            this.logger.trackEvent("Publishing", { message: `Publishing asset ${assetPath}...` });

            const byteArray = await this.downloadBlob(assetPath);
            const fileName = assetPath.split("/").pop();

            if (!assetPath.startsWith("/styles/fonts/icons")) { // TODO: Add exclusion list to settings
                assetPath = Utils.appendSuffixToFileName(assetPath, suffix);
            }

            const contentType = mime.getType(fileName) || "application/octet-stream";

            await this.outputBlobStorage.uploadBlob(assetPath, byteArray, contentType);
        }
        catch (error) {
            console.log(assetPath + " assets error:" + error);
        }
    }

    private async copyAssets(suffix: string): Promise<void> {
        const assetPaths = await this.listAssests();

        if (assetPaths.length > 0) {
            const copyPromises = assetPaths.map(assetPath => this.copyAssetFrom(assetPath, suffix));
            await Promise.all(copyPromises);
        }
    }

    public async listAssests(): Promise<string[]> {
        const files = this.listAllFilesInDirectory(assetsBaseBath);

        if (files.length > 0) {
            return files.map(file => file.split(assetsBaseBath).pop());
        }
        return [];
    }

    private downloadBlob(blobPath: string): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            const fullpath = `${assetsBaseBath}/${blobPath}`.replace("//", "/");

            fs.readFile(fullpath, (error, buffer: Buffer) => {
                if (error) {
                    reject(error);
                    return;
                }

                const arrayBuffer = new ArrayBuffer(buffer.length);
                const unit8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < buffer.length; ++i) {
                    unit8Array[i] = buffer[i];
                }

                resolve(unit8Array);
            });
        });
    }

    private listAllFilesInDirectory(dir: string): string[] {
        const results = [];

        try {
            fs.readdirSync(dir).forEach((file) => {
                file = dir + "/" + file;
                const stat = fs.statSync(file);

                if (stat && stat.isDirectory()) {
                    results.push(...this.listAllFilesInDirectory(file));
                } else {
                    results.push(file);
                }

            });
        }
        catch (error) {
            console.error(`Unable to list files :${error.stack || error.message}`);
        }

        return results;
    }

    public async publish(): Promise<void> {
        const staticAssetSuffix = await this.settingsProvider.getSetting<string>("staticAssetSuffix");

        if (!fs.existsSync(assetsBaseBath)) {
            console.warn(`Folder ${assetsBaseBath} doesn't exist. Copying assets will be skipped.`);
            return;
        }

        await this.copyAssets(staticAssetSuffix);
    }
}