# Multi-Vendor E-Commerce Platform - Project Idea

## 1. Project Overview
A comprehensive multi-vendor e-commerce platform where multiple sellers can create shops and sell products, similar to Amazon or Etsy. The platform features three distinct roles: **User**, **Seller**, and **Admin**, each with specific permissions and dashboards.

## 2. Tech Stack

### Frontend
- **Framework**: React.js (Vite for fast build times)
- **Styling**: Tailwind CSS (for modern, responsive UI) + Lucide React (icons)
- **State Management**: Zustand or Context API (for cart/auth state)
- **HTTP Client**: Axios or TanStack Query (React Query) for data fetching
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma (for type-safe database queries)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies
- **File Upload**: Multer (server-side handling) + Cloudinary (cloud storage)

### Infrastructure
- **Deployment**:
    - **Frontend**: Vercel
    - **Backend**: Render (Web Service)
    - **Database**: Supabase or Render PostgreSQL

---


## 4. Key Features & Implementation Details

### A. Authentication & Authorization (RBAC)
- **Implementation**:
    - Use `bcrypt` to hash passwords.
    - Generate `access_token` (short-lived) and `refresh_token` (long-lived).
    - **Middleware**: Create a `verifyToken` middleware and a `authorizeRoles('ADMIN', 'SELLER')` middleware to protect routes.
    - **Role Logic**:
        - **User**: Can access public products, cart, and own orders.
        - **Seller**: Can access store dashboard, add products (only to their store).
        - **Admin**: Can access all users, approve seller requests/stores.

### B. Product Management & File Upload (Seller)
- **Stack**: Multer + Cloudinary
- **Workflow**:
    1.  Frontend sends `FormData` with image files.
    2.  Express uses `multer` (memory storage) to buffer the file.
    3.  A helper function uploads the buffer to **Cloudinary**.
    4.  Cloudinary returns the secure URL.
    5.  Save the product URL and metadata to PostgreSQL via Prisma.

### C. Shopping Cart (DB-Backed)
- **Why DB-backed?**: To persist the cart if the user logs in from a different device, unlike localStorage carts.
- **Logic**:
    - When a user adds an item: Check if `Cart` exists for `userId`. If not, create it.
    - Check if `CartItem` exists. If yes, update quantity. If no, create `CartItem`.
    - **Frontend**: Optimistic UI updates for immediate feedback.

### D. Checkout & Orders
- **Stock Management**:
    - Use Prisma `$transaction` API.
    - When an Order is placed:
        1.  Verify stock for all items.
        2.  Create `Order` and `OrderItem` records.
        3.  Decrement `Product.stock`.
        4.  Clear `Cart`.
    - If any step fails (e.g., out of stock), entire transaction rolls back.

### E. Admin Panel (Analytics & Moderation)
- **Features**:
    - **User Management**: List all users, ban/delete ability.
    - **Seller Approval**: Sellers register -> Store status is `isVerified: false` -> Admin approves -> `isVerified: true`.
    - **Analytics**:
        - Total Sales (Sum of all orders).
        - Total Users/Sellers count.
        - Top selling products (Prisma aggregation queries).

---

## 5. API Structure (RESTful)

### Auth Routes
- `POST /api/auth/register` (Select role: User/Seller)
- `POST /api/auth/login`
- `GET /api/auth/me` (Get current user profile)

### Product Routes
- `GET /api/products` (Public - with query params for filtering/search)
- `GET /api/products/:id` (Details)
- `POST /api/products` (Seller only - with Multer middleware)
- `PUT /api/products/:id` (Seller - Owner check required)
- `DELETE /api/products/:id` (Seller - Owner check required)

### Store Routes
- `POST /api/stores` (Create store profile)
- `GET /api/stores/:id` (View store page)

### Cart Routes
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/:itemId`

### Admin Routes
- `GET /api/admin/users`
- `PATCH /api/admin/approve-store/:storeId`
- `GET /api/admin/stats`

---

