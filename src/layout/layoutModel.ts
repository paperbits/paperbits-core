export class LayoutModel {
    public type: string = "layout";
    public title: string;
    public description: string;   
    public uriTemplate: string;
    public sections: any[];

    constructor() {
        this.sections = [];
    }
}
