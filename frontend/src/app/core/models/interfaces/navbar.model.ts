export interface Navbar {
    id: number;
    name: string;
    url: string;
    menus: Menu[];
  }
  
  export interface Menu {
    id: number;
    nameEn: string;
    links: MenuLink[];
  }
  
  export interface MenuLink {
    id: number;
    nameAr: string;
    url: string;
  }
  