import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'] // Corrected styleUrls (note the plural)
})
export class AdminSidebarComponent {

   items= [
    {
        label: 'Products', // Main category label
        icon: 'bx bx-store-alt text-xl text-black', // Main category icon
        items: [
            {
                label: 'Add New Product', // Sub-item for adding products
                routerLink: 'new-product', // Route for adding new products
                command: () => {
                    // Logic for adding a new product can go here
                }
            },
            {
                label: 'View All Products', // Sub-item for viewing all products
                routerLink: 'view-products', // Route for viewing products
                command: () => {
                    // Logic for viewing all products
                }
            }
        ]
    },
    
    {
        label: 'Reports & Analytics', // Main category label for reports
        icon: 'text-xl bx bxs-chart', // Main category icon for reports
        items: [
            {
                label: 'Sales Reports', // Sub-item for sales reports
                routerLink: 'reports/sales', // Route for sales reports
                command: () => {
                    // Logic for viewing sales reports
                }
            },
            {
                label: 'Stock Reports', // Sub-item for stock reports
                routerLink: 'reports/stock', // Route for stock reports
                command: () => {
                    // Logic for viewing stock reports
                }
            }
        ]
    }
];

}
