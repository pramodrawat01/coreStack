# Corestack

Corestack is a modern B2B business operations SaaS platform designed to help businesses manage their day-to-day operations from a centralized workspace.

The platform brings inventory, products, orders, customers, suppliers, invoices, payments, users, and business analytics together in one system.

## 🚀 Features

### Authentication & Security
- User registration and login
- Secure authentication
- Password hashing
- Protected routes
- Role-based access control
- Password reset
- Email verification

### Business Management
- Product management
- Inventory management
- Warehouse management
- Customer management
- Supplier management
- Sales order management
- Purchase order management

### Finance
- Invoice management
- Payment tracking
- Outstanding payment tracking
- Financial reports

### Analytics
- Business dashboard
- Revenue analytics
- Sales analytics
- Inventory insights
- Business reports

### Administration
- User management
- Roles & permissions
- Organization management
- Audit logs
- System settings

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- JavaScript
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Services
- Cloudinary - Image and file storage
- Socket.IO - Real-time updates
- Email service - Transactional emails

## 🏗️ Architecture

```text
                    Corestack
                        │
          ┌─────────────┴─────────────┐
          │                           │
       Frontend                    Backend
        React                     Node.js
          │                       Express
          │                           │
          └──────── REST API ──────────┘
                                      │
                                  MongoDB
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                 Cloudinary       Socket.IO         Email
```
### 📁 Project Structure
```
corestack/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── sections/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── .env
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   │   ├── master/
│   │   └── tenant/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md

```

### 🔐 Authentication Flow

```
    User
    │
    ▼
    Register / Login
    │
    ▼
    Authentication
    │
    ▼
    Access Token
    │
    ▼
    Protected Routes
    │
    ▼
    Role & Permission Check
    │
    ▼
    Dashboard
```

### ⚙️ Getting Started

1. Clone the repository
```bash
    git clone https://github.com/YOUR_USERNAME/corestack.git

    cd corestack
```

2. Install dependencies
-  Frontend:
```bash
    cd client
    npm install
```
-  Backend:
```bash
    cd ../server
    npm install
```

3. Configure environment variables
Create a .env file inside the server directory.

```env
    PORT=5000

    MONGO_URI=your_mongodb_connection_string

    JWT_ACCESS_SECRET=your_access_secret
    JWT_REFRESH_SECRET=your_refresh_secret

    CLIENT_URL=http://localhost:5173

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the client & server

```bash
    cd client
    npm run dev

    cd backend
    npm run start
```