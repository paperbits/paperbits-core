import { MediaContract } from "@paperbits/common/media";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver.publish";
import { PictureViewModelBinder } from "../src/picture/ko/pictureViewModelBinder";
import { PictureModelBinder } from "../src/picture/pictureModelBinder";
import { expect } from "chai";


describe("Media permalink resolver", async () => {
    const styleCompiler: any = {
        getStyleModelAsync: (styles: any) => {
            return Promise.resolve({});
        }
    }

    const pictureContract: any = {
        type: "picture",
        caption: "Logo",
        width: "150px",
        height: "40px",
        sourceKey: "uploads/7aa4ab1f-cf14-ef3c-c4c5-420434f4de9e"
    }

    it("Correctly resolves permalink for uploaded media.", async () => {
        const mediaService: any = {
            getMediaByKey: (mediaKey: string): Promise<MediaContract> => {
                const mediaContract: MediaContract = {
                    key: "uploads/7aa4ab1f-cf14-ef3c-c4c5-420434f4de9e",
                    fileName: "your-specs-logo.svg",
                    blobKey: "7aa4ab1f-cf14-ef3c-c4c5-420434f4de9e",
                    description: "Company logo",
                    keywords: "logo",
                    permalink: "/content/your-specs-logo.svg",
                    mimeType: "image/svg+xml",
                    variants: []
                }

                return Promise.resolve(mediaContract);
            }
        };

        const permalinkResolver = new MediaPermalinkResolver(mediaService);
        const pictureViewModelBinder = new PictureViewModelBinder(styleCompiler, permalinkResolver, mediaService);
        const modelBinder = new PictureModelBinder(permalinkResolver);

        const pictureModel = await modelBinder.contractToModel(pictureContract, null);
        const pictureWidgetState: any = {};
        await pictureViewModelBinder.modelToState(pictureModel, pictureWidgetState);

        expect(pictureWidgetState.sourceUrl).to.be.equal("/content/your-specs-logo.svg");
    });

    it("Correctly resolves permalink for referenced media.", async () => {
        const mediaService: any = {
            getMediaByKey: (mediaKey: string): Promise<MediaContract> => {
                const mediaContract: MediaContract = {
                    key: "uploads/7aa4ab1f-cf14-ef3c-c4c5-420434f4de9e",
                    fileName: "your-specs-logo.svg",
                    downloadUrl: "https://content/your-specs-logo.svg",
                    description: "Company logo",
                    keywords: "logo",
                    permalink: "/content/your-specs-logo.svg",
                    mimeType: "image/svg+xml",
                    variants: []
                }

                return Promise.resolve(mediaContract);
            }
        };

        const permalinkResolver = new MediaPermalinkResolver(mediaService);
        const pictureViewModelBinder = new PictureViewModelBinder(styleCompiler, permalinkResolver, mediaService);
        const modelBinder = new PictureModelBinder(permalinkResolver);

        const pictureModel = await modelBinder.contractToModel(pictureContract, null);
        const pictureWidgetState: any = {};
        await pictureViewModelBinder.modelToState(pictureModel, pictureWidgetState);

        expect(pictureWidgetState.sourceUrl).to.be.equal("/content/your-specs-logo.svg");
    });
});    
