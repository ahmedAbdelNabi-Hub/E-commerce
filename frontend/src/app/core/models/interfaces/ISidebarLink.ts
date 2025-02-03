export interface ISidebarLink {
    title: string;
    route: string;
    subLinks?: ISidebarLink[]; 
}