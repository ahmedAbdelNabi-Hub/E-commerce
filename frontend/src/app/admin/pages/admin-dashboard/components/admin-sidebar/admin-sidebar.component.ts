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
                { label: 'Dashboard', route: '/admin/dashboard', icon: 'bx bx-grid-alt' },
                { label: 'Orders', route: '/admin/orders', icon: 'bx bx-cart', badge: 9 },
                { label: 'Invoices', route: '/admin/invoices', icon: 'bx bx-receipt' },
                { label: 'Reports', route: '/admin/reports', icon: 'bx bx-bar-chart-alt-2' }
            ]
        },
        {
            title: 'Product Management',
            items: [
                { label: 'Product Form', route: '/admin/product', icon: 'bx bx-plus-circle' },
                { label: 'Product List', route: '/admin/view-products', icon: 'bx bx-list-ul' },
                { label: 'Statuses', route: '/admin/statuses', icon: 'bx bx-toggle-left' },
                { label: 'Product Attributes', route: '/admin/product-attributes', icon: 'bx bx-slider' }
            ]
        },
        {
            title: 'Advertisement',
            items: [
                { label: 'All Ads', route: '/admin/all-advertisement', icon: 'bx bx-megaphone' },
                { label: 'Create Ad', route: '/admin/create-advertisement', icon: 'bx bx-message-square-add' }
            ]
        }
    ];

    constructor() { }


}
