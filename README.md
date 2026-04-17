# UnityMart

**A Production-Ready, Full-Stack E-Commerce Platform**

Live Demo: [http://13.60.0.208.sslip.io:5173](http://13.60.0.208.sslip.io:5173/)
Repository: [github.com/shivank-1011/fsdproj](https://github.com/shivank-1011/fsdproj)

---

## Overview

UnityMart is a production-grade e-commerce ecosystem built for scale, security, and seamless user experience. It features a multi-tenant architecture with dedicated control planes for Sellers and Administrators, a fully automated CI/CD pipeline, and a decoupled client-server design suitable for real-world deployment.

---

## Key Features

### 1. Secure Authentication with Google OAuth 2.0

Users can sign in via Google OAuth 2.0, reducing onboarding friction while maintaining industry-standard security. Authentication state is managed using JWT (JSON Web Tokens). The sslip.io wildcard DNS service provides a domain-like structure over public IP addresses, which is required for Google OAuth callback validation in non-domain deployments.

### 2. Multi-Role Dashboards

The platform supports two distinct control planes:

**Seller Dashboard** — Allows sellers to list products, manage inventory, upload media, and track store activity.

**Admin Dashboard** — Provides system-wide visibility including store approval workflows, user moderation, and platform analytics.

Role-based access control is implemented using Zustand for global state management and React Router for protected route handling. Each role is scoped to its own set of permitted routes and actions.

### 3. Dynamic Product and Media Management

Product listings support high-resolution imagery managed through the Cloudinary API, which handles cloud storage, delivery, and on-the-fly image optimization. On the backend, all incoming data is validated with Zod schemas before being processed by the Prisma ORM, ensuring data integrity at every layer.

### 4. Automated CI/CD Pipeline

Every push to the main branch triggers a GitHub Actions workflow that builds the React frontend, runs the test suite, and deploys the updated build to AWS EC2 via SCP and SSH. Environment secrets are injected automatically, and the Node.js backend is managed by PM2 for zero-downtime process restarts.

### 5. Advanced API Security and Rate Limiting

The backend is hardened against common attack vectors through a combination of:

- **Express Rate Limit** — Throttles repeated requests to prevent brute-force and DDoS attacks.
- **Helmet.js** — Sets secure HTTP response headers to mitigate common web vulnerabilities.
- **Strict CORS Policy** — Only requests from explicitly authorized origins are accepted, protecting against cross-origin attacks.

---

## Technology Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, Zustand, TanStack Query, Lucide Icons |
| Backend     | Node.js, Express.js, Prisma ORM                 |
| Database    | PostgreSQL (hosted on Supabase)                 |
| DevOps      | AWS EC2, PM2, GitHub Actions                    |
| Storage     | Cloudinary (Media Management)                   |
| Security    | Helmet.js, Express Rate Limit, JWT, CORS        |

---

## Architecture

UnityMart follows a decoupled client-server architecture:

**Backend (Port 5001)**
A RESTful API built with Express.js, optimized for performance and security. It communicates with a cloud-hosted PostgreSQL database via Prisma ORM and exposes typed, validated endpoints consumed by the frontend.

**Frontend (Port 5173)**
A modern Single Page Application (SPA) built with React 19. It communicates with the backend via Axios and is served as a static production build through PM2.

**Proxy and DNS**
The platform uses sslip.io wildcard DNS to map the EC2 public IP to a domain-like URL. This is essential for Google OAuth redirect URI compliance and improves the overall deployment experience without requiring a registered domain.

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivank-1011/fsdproj.git
cd fsdproj
```

### 2. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Environment Configuration

Create a `.env` file in both the `server/` and `client/` directories using the provided `.env.example` templates. Required variables include database connection strings, JWT secrets, Google OAuth credentials, and Cloudinary API keys.

### 4. Run in Development

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev
```

---

## Production Deployment

The repository includes a deployment script for Ubuntu and AWS EC2 instances:

```bash
bash scripts/deploy.sh
```

This script handles dependency installation, frontend build generation, environment configuration, and PM2 process management for both the client and server.

---

## Author

**Shivank Gupta**
Full Stack Developer
[github.com/shivank-1011](https://github.com/shivank-1011)
