import parallel from "await-parallel-limit";
import { maxParallelPublisingTasks } from "@paperbits/common/constants";
import { HttpClient, HttpResponse } from "@paperbits/common/http";
import { IPublisher } from "@paperbits/common/publishing";
import { IBlobStorage, Query } from "@paperbits/common/persistence";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { Logger } from "@paperbits/common/logging";


export class MediaPublisher implements IPublisher {
    constructor(
        private readonly mediaService: IMediaService,
        private readonly blobStorage: IBlobStorage,
        private readonly outputBlobStorage: IBlobStorage,
        private readonly httpClient: HttpClient,
        private readonly logger: Logger
    ) { }

    private async publishFromUrl(mediaFile: MediaContract): Promise<void> {
        this.logger.trackEvent("Publishing", { message: `Publishing media ${mediaFile.fileName} from URL...` });

        let response: HttpResponse<any>;

        try {
            response = await this.httpClient.send({ url: mediaFile.downloadUrl });
        }
        catch (error) {
            this.logger.trackEvent("Publishing", { message: `Could not download media from URL ${mediaFile.downloadUrl}. ${error.stack || error.message}` });
            return null;
        }

        if (response?.statusCode !== 200) {
            this.logger.trackEvent("Publishing", { message: `Could not download media from URL ${mediaFile.downloadUrl}. Status code: ${response?.statusCode}` });
            return null;
        }

        const content = response.toByteArray();
        await this.uploadToStorage(mediaFile.permalink, content, mediaFile.mimeType);
    }

    private async publishFromStorage(mediaFile: MediaContract): Promise<void> {
        this.logger.trackEvent("Publishing", { message: `Publishing media ${mediaFile.fileName} from storage...` });

        let content: Uint8Array;

        try {
            content = await this.blobStorage.downloadBlob(mediaFile.blobKey);
        }
        catch (error) {
            this.logger.trackEvent("Publishing", { message: `Could not download media ${mediaFile.blobKey} from source storage. ${error.stack || error.message}` });
            return null;
        }

        if (!content) {
            this.logger.trackEvent("Publishing", { message: `Blob with key ${mediaFile.blobKey} not found in source storage.` });
            return null;
        }

        await this.uploadToStorage(mediaFile.permalink, content, mediaFile.mimeType);
    }

    private async uploadToStorage(key: string, content: Uint8Array, mimeType: string): Promise<void> {
        try {
            await this.outputBlobStorage.uploadBlob(key, content, mimeType);
        }
        catch (error) {
            throw new Error(`Unable to upload media file to destination storage. ${error.stack || error.message}`);
        }
    }

    private async renderMediaFile(mediaFile: MediaContract): Promise<void> {
        if (!mediaFile.permalink) {
            this.logger.trackEvent("Publishing", { message: `Skipping media with no permalink specified: "${mediaFile.fileName}".` });
            return;
        }

        if (!mediaFile.blobKey && !mediaFile.downloadUrl) {
            this.logger.trackEvent("Publishing", { message: `Skipping media with no blob key or download URL specified: ${mediaFile.fileName}.` });
            return;
        }

        if (mediaFile.blobKey) {
            await this.publishFromStorage(mediaFile);
            return;
        }

        if (mediaFile.downloadUrl) {
            await this.publishFromUrl(mediaFile);
            return;
        }
    }

    public async publish(): Promise<void> {
        const query: Query<MediaContract> = Query.from<MediaContract>();
        let pagesOfResults = await this.mediaService.search(query);

        do {
            const tasks = [];
            const mediaFiles = pagesOfResults.value;

            for (const mediaFile of mediaFiles) {
                tasks.push(() => this.renderMediaFile(mediaFile));
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