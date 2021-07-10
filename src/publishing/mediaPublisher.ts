import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import parallel from "await-parallel-limit";
import { maxParallelPublisingTasks } from "@paperbits/common/constants";
import { HttpClient, HttpResponse } from "@paperbits/common/http";
import { IPublisher } from "@paperbits/common/publishing";
import { IBlobStorage, Query } from "@paperbits/common/persistence";
import { IMediaService, MediaContract, MediaVariantContract } from "@paperbits/common/media";
import { Logger } from "@paperbits/common/logging";


export class MediaPublisher implements IPublisher {
    constructor(
        private readonly mediaService: IMediaService,
        private readonly blobStorage: IBlobStorage,
        private readonly outputBlobStorage: IBlobStorage,
        private readonly httpClient: HttpClient,
        private readonly logger: Logger
    ) { }

    private async publishFromUrl(permalink: string, mediaFile: MediaVariantContract): Promise<void> {
        let response: HttpResponse<any>;

        try {
            response = await this.httpClient.send({ url: mediaFile.downloadUrl });
        }
        catch (error) {
            this.logger.trackEvent("Publishing", { message: `Could not download media from URL ${mediaFile.downloadUrl}. ${error.message}` });
            return null;
        }

        if (response?.statusCode !== 200) {
            this.logger.trackEvent("Publishing", { message: `Could not download media from URL ${mediaFile.downloadUrl}. Status code: ${response?.statusCode}` });
            return null;
        }

        const content = response.toByteArray();
        await this.uploadToStorage(permalink, content, mediaFile.mimeType);
    }

    private async publishFromStorage(permalink: string, mediaFile: MediaVariantContract): Promise<void> {
        let content: Uint8Array;

        try {
            content = await this.blobStorage.downloadBlob(mediaFile.blobKey);
        }
        catch (error) {
            this.logger.trackEvent("Publishing", { message: `Could not download media ${mediaFile.blobKey} from source storage. ${error.message}` });
            return null;
        }

        if (!content) {
            this.logger.trackEvent("Publishing", { message: `Blob with key ${mediaFile.blobKey} not found in source storage.` });
            return null;
        }

        await this.uploadToStorage(permalink, content, mediaFile.mimeType);
    }

    private async uploadToStorage(key: string, content: Uint8Array, mimeType: string): Promise<void> {
        try {
            await this.outputBlobStorage.uploadBlob(key, content, mimeType);
        }
        catch (error) {
            throw new Error(`Unable to upload media file to destination storage. ${error.stack || error.message}`);
        }
    }

    private async renderMediaFile(permalink: string, mediaFile: MediaVariantContract): Promise<void> {
        if (mediaFile.blobKey) {
            await this.publishFromStorage(permalink, mediaFile);
            return;
        }

        if (mediaFile.downloadUrl) {
            await this.publishFromUrl(permalink, mediaFile);
            return;
        }
    }

    public async publish(): Promise<void> {
        const query: Query<MediaContract> = Query.from<MediaContract>();
        let pagesOfResults = await this.mediaService.search(query);

        do {
            const tasks = [];
            const mediaContracts = pagesOfResults.value;

            for (const mediaContract of mediaContracts) {
                if (!mediaContract.permalink) {
                    this.logger.trackEvent("Publishing", { message: `Skipping media with no permalink specified: "${mediaContract.fileName}".` });
                    continue;
                }

                this.logger.trackEvent("Publishing", { message: `Publishing media ${mediaContract.fileName}...` });

                const original: MediaVariantContract = {
                    blobKey: mediaContract.blobKey,
                    downloadUrl: mediaContract.downloadUrl,
                    mimeType: mediaContract.mimeType
                };

                if (!mediaContract.blobKey && !mediaContract.downloadUrl) {
                    this.logger.trackEvent("Publishing", { message: `Skipping media with no blob key or download URL specified: ${mediaContract.fileName}.` });
                    continue;
                }

                tasks.push(() => this.renderMediaFile(mediaContract.permalink, original));

                if (mediaContract.variants) {
                    for (const variant of mediaContract.variants) {
                        if (!mediaContract.blobKey && !mediaContract.downloadUrl) {
                            this.logger.trackEvent("Publishing", { message: `Skipping media variant with no blob key or download URL specified: ${mediaContract.fileName}.` });
                            continue;
                        }

                        const variantPermalink = MediaUtils.getPermalinkForMediaVariant(mediaContract.permalink, variant);
                        tasks.push(() => this.renderMediaFile(variantPermalink, variant));
                    }
                }
            }

            await parallel(tasks, maxParallelPublisingTasks);

            if (pagesOfResults.takeNext) {
                pagesOfResults = await pagesOfResults.takeNext();
            }
            else {
                pagesOfResults = null;
            }
        }
        while (pagesOfResults);
    }
}