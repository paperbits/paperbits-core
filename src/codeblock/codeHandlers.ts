
import { Code } from "./ko/code";
import { ProgressPromise } from "@paperbits/common";
import { IWidgetOrder, MediaHandlers } from "@paperbits/common/editing";
import { IContentDropHandler } from "@paperbits/common/editing";
import { IContentDescriptor } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IDataTransfer } from "@paperbits/common/editing";
import { ICodeConfig } from "./ko/ICodeConfig";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IEventManager } from "@paperbits/common/events";


export class CodeHandlers extends MediaHandlers implements IWidgetHandler, IContentDropHandler {
    private static DefaultCodeUri = "https://raw.githubusercontent.com/daniellmb/once.js/master/once.js";
    private static DefaultThumbnailUri = "data:application/octet-stream;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGcgaWQ9ImNvZGUiIG9wYWNpdHk9IjAuNzUiPgoJPHBhdGggaWQ9ImxlZnQtYnJhY2tldCIgZD0iTTQsMTJ2LTFoMWMxLDAsMSwwLDEtMVY3LjYxNEM2LDcuMSw2LjAyNCw2LjcxOCw2LjA3Myw2LjQ3MkM2LjEyNyw2LjIyLDYuMjEyLDYuMDA5LDYuMzMsNS44MzkKCQlDNi41MzQsNS41Niw2LjgwMyw1LjM2NCw3LjEzOCw1LjI1NUM3LjQ3Myw1LjE0LDguMDEsNSw4Ljk3Myw1SDEwdjFIOS4yNDhjLTAuNDU3LDAtMC43NywwLjE5MS0wLjkzNiwwLjQwOAoJCUM4LjE0NSw2LjYyMyw4LDYuODUzLDgsNy40NzZ2MS44NTdjMCwwLjcyOS0wLjA0MSwxLjE4LTAuMjQ0LDEuNDkzYy0wLjIsMC4zMDctMC41NjIsMC41MjktMS4wOSwwLjY2NwoJCWMwLjUzNSwwLjE1NSwwLjksMC4zODUsMS4wOTYsMC42ODhDNy45NjEsMTIuNDg0LDgsMTIuOTM4LDgsMTMuNjY1djEuODYyYzAsMC42MTksMC4xNDUsMC44NDgsMC4zMTIsMS4wNjIKCQljMC4xNjYsMC4yMiwwLjQ3OSwwLjQwNywwLjkzNiwwLjQwN0wxMCwxN2wwLDB2MUg4Ljk3M2MtMC45NjMsMC0xLjUtMC4xMzMtMS44MzUtMC4yNDhjLTAuMzM1LTAuMTA5LTAuNjA0LTAuMzA3LTAuODA4LTAuNTkxCgkJYy0wLjExOC0wLjE2NS0wLjIwMy0wLjM3NC0wLjI1Ny0wLjYyNUM2LjAyNCwxNi4yODMsNiwxNS45LDYsMTUuMzg3VjEzYzAtMSwwLTEtMS0xSDR6Ii8+Cgk8dXNlIHRyYW5zZm9ybT0ibWF0cml4KC0xLDAsMCwxLDI0LDApIiBpZD0icmlnaHQtYnJhY2tldCIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bGluazpocmVmPSIjbGVmdC1icmFja2V0IiAvPgo8L2c+Cjwvc3ZnPgo=";
    private static ThumbnailTimeOffset = 60;

    constructor(permalinkService: IPermalinkService, eventManager: IEventManager) {
        super(["application/javascript", "text/plain", "text/html"], [".js", ".json", ".cs", ".java"]);
    }

    private getWidgetOrderByConfig(code: string, language: string, theme: string, editable: boolean): IWidgetOrder {
        let pictureWidgetModel = {
            displayName: "Code",
            params: {},
            oncreate: (codeModel: Code) => {
                codeModel.lang(language);
                codeModel.code(code);
                codeModel.theme(theme);
                codeModel.isEditable(editable);
            }
        };

        var widgetOrder: IWidgetOrder = {
            name: "code-block",
            displayName: "Code",

            createWidget: () => {
                let htmlElement = document.createElement("widget");

                // htmlElement["attachedModel"] = pictureWidgetModel.model;
                // htmlElement.style.width = "200px";
                // htmlElement.style.height = "150px";

                // ko.applyBindingsToNode(htmlElement, { component: { name: pictureWidgetModel.name, oncreate: pictureWidgetModel.oncreate } })

                return { element: htmlElement }
            },
            createModel: async () => {
                //return pictureWidgetModel.model;
            }
        }

        return widgetOrder;
    }

    public getWidgetOrderByDefault(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig(`function foo(items) {\r\n\tvar x = "Put your code snippet here";\r\n\treturn x;\r\n}`, "javascript", "clouds", true));
    }

    public getWidgetOrder(config?: ICodeConfig): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig(`function foo(items) {\r\n\tvar x = "Put your code snippet here";\r\n\treturn x;\r\n}`, "javascript", "clouds", true));
    }

    getLangByFileName(fileName: string): string {
        var extension = fileName.split(".").pop();
        switch (extension) {
            case "cs":
                return "csharp";
            case "java":
                return "java";
            case "c":
            case "h":
                return "c_cpp";
            case "m":
                return "objectivec";
            case "htm":
            case "html":
                return "html";
            case "js":
            default:
                return "javascript";
        }
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        return null;
        // var descriptor: IContentDescriptor = {
        //     title: "Code",
        //     description: dataTransfer.name,
        //     getWidgetOrder: () => {
        //         var config: ICodeConfig = {
        //             onload: this.readFileAsText(item.file),
        //             filename: item.file.name,
        //             theme: "clouds"
        //         };
        //         return this.getWidgetOrder(config);
        //     },
        //     thumbnailUrl: CodeHandlers.DefaultThumbnailUri,
        //     uploadables: [dataTransfer.source]
        // };

        // return descriptor;
    }

    private readFileAsText(file: File): ProgressPromise<string> {
        return new ProgressPromise((resolve, reject, progress) => {
            var reader = new FileReader();

            reader.onload = (event: any) => {
                var text = event.target.result;
                resolve(text);
            };

            reader.onprogress = (progressEvent: ProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    var percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    progress(percentLoaded);
                }
            };

            reader.readAsText(file);
        });
    }

    title;
    description: string;
    layout: string;
}