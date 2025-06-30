import { query } from '@angular/animations';
import { Component } from '@angular/core';
interface MenuItem {
    label: string;
    route: string;
    icon: string;
    badge?: number;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}
@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.css'] 
})
export class AdminSidebarComponent {
    menuSections: MenuSection[] = [
        {
            title: 'Orders & Reports',
            items: [
                { label: 'OverView', route: '/admin/reports', icon: 'bx bx-world' },
                { label: 'Report', route: '/admin/reports', icon: 'bx-bx-report' },
                { label: 'Orders', route: '/admin/orders', icon: 'bx-cart', badge: 9 },
                { label: 'Invoices', route: '/admin/invoices', icon: 'bx-receipt' }
            ]
        },
        {
            title: 'Product Management',
            items: [
                { label: 'Products', route: '/admin/product', icon: 'bx-box' },
                { label: 'Product Prices', route: '/admin/product-prices', icon: 'bx-dollar' },
                { label: 'Product Inventory', route: '/admin/product-inventory', icon: 'bx-home' },
                { label: 'Product Categories', route: '/admin/product-categories', icon: 'bx-category' },
                { label: 'Product Tags', route: '/admin/product-tags', icon: 'bx-purchase-tag' },
                { label: 'Product Attributes', route: '/admin/product-attributes', icon: 'bx-detail' },
                { label: 'Product Options', route: '/admin/product-options', icon: 'bx-slider' },
                { label: 'Product Collections', route: '/admin/product-collections', icon: 'bx-layer' },
                { label: 'Product Labels', route: '/admin/product-labels', icon: 'bx-purchase-tag-alt' },
                { label: 'Brands', route: '/admin/brands', icon: 'bx-registered' },
                { label: 'Reviews', route: '/admin/reviews', icon: 'bx-star' },
                { label: 'Flash Sales', route: '/admin/flash-sales', icon: 'bx-bolt-circle' }
            ]
        }
    ];

    constructor() { }
    addMenuSection(section: MenuSection): void {
        this.menuSections.push(section);
    }
    addMenuItem(sectionTitle: string, item: MenuItem): void {
        const section = this.menuSections.find(s => s.title === sectionTitle);
        if (section) {
            section.items.push(item);
        }
    }

    updateBadge(route: string, badgeCount: number): void {
        this.menuSections.forEach(section => {
            const item = section.items.find(i => i.route === route);
            if (item) {
                item.badge = badgeCount;
            }
        });
    }

}
