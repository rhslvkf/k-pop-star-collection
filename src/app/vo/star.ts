export class Site {
    blog: string;
    instagram: string;
    officialSite: string;

    constructor(blog: string, instagram: string, officialSite: string) {
        this.blog = blog;
        this.instagram = instagram;
        this.officialSite = officialSite;
    }
}

export class Star {
    name: string;
    order?: string;
    updateDate?: string;
    sites: Site;
    favoriteFlag: boolean;

    constructor(name: string, sites: Site) {
        this.name = name;
        this.sites = sites;
    }
}