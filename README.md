# Brew & Code

A full-stack sweets shopping web application with separate **Customer** and **Admin** interfaces. Customers can browse products, manage a cart, and place orders. Admins have a dedicated dashboard for product management, order tracking, and business analytics.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript (ES Modules) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Security | Helmet, CORS, Zod validation, XSS sanitization |

---

## Features

### Authentication & Authorization

- User registration and login with encrypted passwords
- JWT-based authentication with dual-token strategy (short-lived access token, long-lived refresh token)
- Role-based access control — routes are protected by role (Customer or Admin)
- Client-side auth guards redirect unauthenticated users to the login page

### Customer Interface

- Browse a product menu with add-to-cart functionality
- Cart sidebar with quantity controls and item removal
- Order placement with a confirmation countdown
- Personalized navigation displaying the logged-in user's name and avatar initial

### Admin Dashboard

- Statistics overview: total products, orders, customers, and revenue
- Full CRUD operations for product management (add, edit, delete) via modal forms
- Orders table with expandable product details per order and delete capability
- Client-side search and sort for the products table

### Backend & API

- RESTful API with a layered architecture (Routes, Middleware, Controllers, Services, Models)
- Three MongoDB collections: Users, Products, and Orders
- MongoDB aggregation pipelines for order reporting with cross-collection joins
- Centralized error handling with consistent JSON response formatting
- Input validation using Zod schemas and custom regex-based HTML sanitization

---

## Project Structure

```
BREW&CODE/
├── be/                 # Backend — Express.js API
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── constants/
│       ├── controllers/
│       ├── helpers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── utils/
│
└── fe/                 # Frontend — Static HTML/CSS/JS
    ├── index.html
    └── src/
        ├── api/
        ├── constants/
        ├── helpers/
        ├── js/
        ├── pages/
        ├── styles/
        └── utils/
```

---

## Pages

| Page | Access | Description |
|---|---|---|
| Welcome | Public | Landing page with links to login, signup, and admin |
| Login | Public | Email/password authentication with role-based redirect |
| Sign Up | Public | New user registration with field-level validation |
| Homepage | Customer | Product menu, cart, and order placement |
| Admin Dashboard | Admin | Product CRUD, order management, and business stats |
| Orders | Admin | Order list with user details and status tracking |

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** — either a local instance or a MongoDB Atlas connection string
- **Git** — to clone the repository
- A code editor such as **VS Code** (with the Live Server extension for the frontend)

### Step 1 — Clone the Repository

Clone the project to your local machine and navigate into the project folder.

### Step 2 — Set Up Environment Variables

Create a `.env` file inside the `be/` directory with the following values:

| Variable | Description |
|---|---|
| `PORT` | Port for the backend server (e.g. `8080`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `ACCESS_TOKEN` | Secret key for signing JWT access tokens |
| `REFRESH_TOKEN` | Secret key for signing JWT refresh tokens |

### Step 3 — Install Backend Dependencies

Open a terminal, navigate to the `be/` directory, and install the required packages using npm.

### Step 4 — Start the Backend Server

Run the development server from the `be/` directory. The API will start on the port specified in your `.env` file.

### Step 5 — Serve the Frontend

Open the `fe/` folder in VS Code and use the **Live Server** extension:

1. Right-click `index.html`
2. Select **Open with Live Server**
3. The app will open at `http://127.0.0.1:5500`

Alternatively, serve the frontend with any static file server of your choice.

### Step 6 — Verify CORS Configuration

Make sure the backend's CORS settings include the frontend's origin (e.g. `http://127.0.0.1:5500`). This is configured in the backend's `server.js` file.

### Step 7 — Use the Application

1. Open the welcome page in your browser
2. Register a new account via the Sign Up page
3. Log in with your credentials — you will be redirected based on your role
4. **As a Customer:** browse products, add items to cart, and place orders
5. **As an Admin:** manage products, view orders, and monitor business stats from the dashboard

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/user/signup` | Register a new user |
| `POST` | `/api/user/login` | Authenticate and receive tokens |
| `GET` | `/api/user` | Get current user data (customer) |
| `GET` | `/api/user/admin` | Get admin data and customer count |
| `POST` | `/api/product/new` | Create a new product |
| `GET` | `/api/product` | List all products |
| `GET` | `/api/product/total-products` | Get total product count |
| `PATCH` | `/api/product/edit/:id` | Update a product |
| `DELETE` | `/api/product/delete/:id` | Delete a product |
| `POST` | `/api/order/new` | Place a new order |
| `GET` | `/api/order` | List all orders |
| `GET` | `/api/order/totalOrders` | Get total order count |
| `GET` | `/api/order/revenue` | Get total revenue |
| `DELETE` | `/api/order/delete/:id` | Delete an order |

---

## License

This project was built for educational and portfolio purposes.
