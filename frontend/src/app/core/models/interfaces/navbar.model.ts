export interface Navbar {
  id: number;
  name: string;
  url: string;
  menus: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  links: MenuLink[];
}

export interface MenuLink {
  id: number;
  name: string;
  url: string;
}
