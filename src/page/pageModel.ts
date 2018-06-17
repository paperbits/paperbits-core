import { SectionModel } from "../section/sectionModel";

export class PageModel {
    public title: string;
    public description: string;
    public keywords: string;
    public sections: SectionModel[];

    constructor() {
        this.sections = [];
    }
}
