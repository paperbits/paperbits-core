import * as ko from "knockout";

export class Toast {
    public title: ko.Observable<string>;
    public content: ko.Observable<string>;
    public progress: ko.Observable<number>;
    public state: ko.Observable<string>;

    constructor(title: string, content: string, state: string = "progress", progress: number = 0) {
        this.title = ko.observable<string>(title);
        this.content = ko.observable<string>(content);
        this.progress = ko.observable<number>();
        this.progress.subscribe(this.onProgressUpdate.bind(this));
        this.state = ko.observable<string>(state);

        this.progress(progress);
    }

    private onProgressUpdate(progress: number) {
        if (progress === 100) {
            this.state("success");
        }
    }
}