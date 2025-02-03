import { ISidebarLink } from "../models/interfaces/ISidebarLink";

export const sidebarLinks : ISidebarLink[] = [
    { title: 'لوحة التحكم', route: '/admin/dashboard' }, // Dashboard
    { title: 'الإعلانات', route: '/admin/advertisements' }, // Advertisements
    {
        title: 'المنتجات',
        route: '',
        subLinks: [
            { title: 'عرض المنتجات', route: '/admin/products/view' }, // View Products
            { title: 'إضافة منتج', route: '/admin/products/add' }, // Add Product
            { title: 'الفئات', route: '/admin/categories' }, // Categories
            { title: 'مراجعات المنتجات', route: '/admin/products/reviews' } // Product Reviews
        ]
    },
    { title: 'الطلبات', route: '/admin/orders' }, // Orders
    {
        title: 'المستخدمون',
        route: '',
        subLinks: [
            { title: 'عرض المستخدمين', route: '/admin/users/view' }, // View Users
            { title: 'إضافة مستخدم', route: '/admin/users/add' } // Add User
        ]
    },
    { title: 'الإعدادات', route: '/admin/settings' }, // Settings
    { title: 'التقارير', route: '/admin/reports' } // Reports
];
