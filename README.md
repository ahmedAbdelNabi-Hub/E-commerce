# 🛒 E-Commerce Platform (Full-Stack)

**🗓 Duration:** _Feb 2025 – May 2025_  
A full-featured, scalable, and production-ready **e-commerce application** built using **ASP.NET Web API** and **Angular**, optimized for modern shopping experiences, performance, and administrative efficiency.

---

## 📌 Project Overview

This platform allows customers to **browse products**, manage **carts and orders**, apply **gifts and discounts**, and complete **secure payments**. Admins have advanced control via a rich dashboard to manage products, orders, users, and marketing elements such as **advertisements and gift offers**. Built with **Onion Architecture**, it promotes clean code separation, modularity, and testability.

---

## 🔧 Tech Stack

| Layer             | Technologies Used                                                                 |
|------------------|------------------------------------------------------------------------------------|
| **Frontend**      | Angular, Tailwind CSS, Angular Lazy Loading                                        |
| **Backend**       | ASP.NET Web API, Entity Framework Core, LINQ, SQL Server                          |
| **Caching**       | Redis (for product and cart caching)                                               |
| **Authentication**| Google OAuth 2.0, ASP.NET Identity, JWT Token Authentication                      |
| **Payment**       | Stripe / PayPal APIs                                                               |
| **Architecture**  | Onion Architecture, Repository, Unit of Work, Specification Pattern               |
| **Data Mapping**  | AutoMapper + Extension Methods                                                     |
| **Cross-cutting** | Middleware, Action Filters, Role Management, Logging, CORS                        |

---

## 🚀 Key Features

### 👤 **User Features**
- 🔍 **Search, Filter & Sort**: Quickly find products with multi-level filters
- 🛒 **Cart & Orders**: Add to cart, edit quantities, view order history
- 💳 **Secure Checkout**: Stripe or PayPal for seamless online payments
- 🎁 **Apply Gifts & Coupons**: Redeem promotional offers during checkout
- 🔐 **Login with Google**: Easy sign-in using Google OAuth
- 📱 **Responsive UI**: Built mobile-first with Tailwind CSS
- 🛍 **Track Orders**: View statuses like *Processing, Shipped, Delivered*
- ✉️ Email notifications


### 👨‍💼 **Admin Features**
- ➕ **Add/Edit/Delete Products**: Full product management capabilities
- 🎯 **Create Advertisements**: Upload promotional banners or image sliders
- 🏷️ **Add Discount Campaigns**: Flat/off percentage-based discounts
- 🎁 **Manage Gift Offers**: Assign gifts to specific products or orders
- 📊 **Dashboard Analytics**: View sales, product stats, and inventory levels
- 🧾 **Order Management**: Update order statuses, track payment state
- 👥 **Role Management**: Assign roles and permissions
- 📤 **Export Orders/Reports**: Export order history, sales data
- ✉️ Send Email notifications 


---

## 🧱 Architecture

Following **Onion Architecture** with a clear separation of concerns:

```
├── ECommerce.Domain          
├── ECommerce.Application     
├── ECommerce.Infrastructure  
├── ECommerce.Api             
├── ECommerce.Contracts      
```

---

## 🔄 Design Patterns & Best Practices

- 🧩 **Repository + Unit of Work**: Decoupled and testable data access
- 🔍 **Specification Pattern**: Dynamic and reusable queries
- 🧭 **AutoMapper Extensions**: Seamless object mapping
- 🧱 **Middleware & Action Filters**: For centralized error handling, logging, auth
- 🛡️ **JWT + ASP.NET Identity**: Robust token-based role management
- 🔃 **Pagination + Lazy Loading**: Performance-first API and UI design

---

## 📂 Example Project Structure

```
src/
├── ECommerce.Api
├── ECommerce.Application
├── ECommerce.Contracts
├── ECommerce.Domain
├── ECommerce.Infrastructure
```

---

## 🔗 GitHub Repository

👉 [GitHub – E-Commerce Platform](https://github.com/your-username/ecommerce-app)

---

## 🎯 Future Enhancements

- 🗣️ Multi-language support (e.g., Arabic, English) with ngx-translate
- 📦 Integration with third-party logistics (real-time tracking)
- 🧾 PDF Invoice Generator on successful order
- 🧠 AI-based recommendation engine
- 🔄 Full CI/CD pipeline with Docker, GitHub Actions
