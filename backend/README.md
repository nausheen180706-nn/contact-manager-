# Contact Manager - Backend REST API

A beginner-friendly RESTful API server built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for the Contact Manager web application.

---

## 📌 Architecture Overview

```text
React Frontend (Vite)
       ↓
  HTTP Requests (fetch)
       ↓
  Express Server (server.js)
       ↓
  Routes (/api/contacts)
       ↓
  Controllers (contactController.js)
       ↓
  Mongoose Model (Contact.js)
       ↓
  MongoDB Database
       ↓
  JSON Response
       ↓
  React Frontend UI Update
```

---

## 🗂️ Folder Structure

```text
backend/
│
├── config/
│   └── db.js                 # Mongoose connection logic
│
├── controllers/
│   └── contactController.js   # Request handlers for CRUD, stats & search
│
├── models/
│   └── Contact.js             # Mongoose schema and model definition
│
├── routes/
│   └── contactRoutes.js       # Express route mapping
│
├── middleware/
│   ├── errorMiddleware.js    # Global error handler
│   └── notFoundMiddleware.js # 404 handler for undefined routes
│
├── seed/
│   └── seedContacts.js        # Database initial sample data seeder
│
├── .env                       # Environment configuration
├── .gitignore                 # Files ignored by Git
├── package.json               # Backend dependencies and scripts
├── server.js                  # Express entry point
└── README.md                  # Documentation and API guide
```

---

## 🚀 Quick Start Guide

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (`.env`)
Create or verify `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/contact_manager
CLIENT_URL=http://localhost:5173
```
> If using **MongoDB Atlas**, replace `MONGO_URI` with your connection string:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/contact_manager?retryWrites=true&w=majority`

### 4. Seed sample contacts into MongoDB
```bash
npm run seed
```

### 5. Start the backend development server
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Backend health check (used by frontend status indicator) |
| **GET** | `/api/contacts` | Get all contacts (sorted by newest first) |
| **GET** | `/api/contacts?search=query` | Search contacts by name, email, or phone (case-insensitive) |
| **GET** | `/api/contacts/stats` | Get count of total, active, and recently added contacts |
| **GET** | `/api/contacts/:id` | Get single contact document by MongoDB ID |
| **POST** | `/api/contacts` | Create a new contact |
| **PUT** | `/api/contacts/:id` | Update contact details |
| **PATCH** | `/api/contacts/:id/status` | Toggle or update contact status (`isActive`) |
| **DELETE** | `/api/contacts/:id` | Remove a contact from database |

---

## 📬 Sample Requests & Responses

### 1. Health Check
- **`GET /api/health`**
- Response:
```json
{
  "success": true,
  "message": "Contact Manager API is running"
}
```

### 2. Get All Contacts
- **`GET /api/contacts`**
- Response:
```json
{
  "success": true,
  "message": "Contacts fetched successfully",
  "data": [
    {
      "id": "6602fa9e8b7c1234567890ab",
      "name": "Arun Kumar",
      "email": "arun@example.com",
      "phone": "9876543210",
      "isActive": true,
      "status": "active",
      "createdAt": "2026-03-25T10:00:00.000Z",
      "updatedAt": "2026-03-25T10:00:00.000Z"
    }
  ]
}
```

### 3. Get Contact Statistics
- **`GET /api/contacts/stats`**
- Response:
```json
{
  "success": true,
  "data": {
    "totalContacts": 8,
    "activeContacts": 6,
    "recentlyAdded": 5
  }
}
```

### 4. Create Contact
- **`POST /api/contacts`**
- Request Body:
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543211"
}
```
- Response: `201 Created`
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": "6602fb4a8b7c1234567890ac",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "9876543211",
    "isActive": true,
    "status": "active"
  }
}
```

### 5. Update Contact
- **`PUT /api/contacts/6602fb4a8b7c1234567890ac`**
- Request Body:
```json
{
  "name": "Priya Sharma Updated",
  "email": "priyaupdated@example.com",
  "phone": "9876543219"
}
```
- Response: `200 OK`
```json
{
  "success": true,
  "message": "Contact updated successfully",
  "data": {
    "id": "6602fb4a8b7c1234567890ac",
    "name": "Priya Sharma Updated",
    "email": "priyaupdated@example.com",
    "phone": "9876543219",
    "isActive": true
  }
}
```

### 6. Delete Contact
- **`DELETE /api/contacts/6602fb4a8b7c1234567890ac`**
- Response: `200 OK`
```json
{
  "success": true,
  "message": "Contact deleted successfully",
  "data": null
}
```
