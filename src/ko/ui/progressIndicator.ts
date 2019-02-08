import * as ko from "knockout";

export class ProgressIndicator {
    public title: ko.Observable<string>;
    public content: ko.Observable<string>;
    public progress: ko.Observable<number>;
    public complete: ko.Observable<boolean>;

    constructor(title: string, content: string, progress: number = 0) {
        this.title = ko.observable<string>(title);
        this.content = ko.observable<string>(content);
        this.progress = ko.observable<number>();
        this.progress.subscribe(this.onProgressUpdate.bind(this));
        this.complete = ko.observable<boolean>(false);

        this.progress(progress);
    }

    private onProgressUpdate(progress: number) {
        this.complete(progress === 100);
    }
}