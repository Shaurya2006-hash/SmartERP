# 🚀 SmartERP - Business Management System

A full-stack ERP (Enterprise Resource Planning) system developed using **Next.js**, **Node.js**, **Express.js**, and **PostgreSQL** to simplify accounting, inventory management, and voucher management for small and medium-sized businesses.

---

# 📖 Table of Contents

- Project Overview
- Features
- Technology Stack
- Folder Structure
- Installation
- Environment Variables
- Running the Project
- Screenshots
- API Endpoints
- Future Scope
- Author

---

# 📌 Project Overview

SmartERP is a web-based Enterprise Resource Planning (ERP) application that helps businesses manage:

- User Authentication
- Company Management
- Ledger Groups
- Ledgers
- Stock Groups
- Units
- Stock Items
- Payment Voucher
- Receipt Voucher
- Journal Voucher
- Purchase Voucher
- Sales Voucher
- Dashboard Analytics

The application digitizes accounting processes and inventory management while providing a clean and responsive interface.

---

# ✨ Features

## 🔐 User Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Encryption
- Protected Routes

### Screenshot

![Login](screenshots/login.png)

![Register](screenshots/register.png)

---

## 📊 Dashboard

Features

- Company Overview
- Ledger Count
- Stock Group Count
- Unit Count
- Stock Item Count
- Quick Navigation
- Keyboard Shortcuts

### Screenshot

![Dashboard](screenshots/dashboard.png)

---

## 🏢 Company Management

Features

- Create Company
- Edit Company
- Company Details
- GST Number
- Financial Year
- State

### Screenshot

![Company](screenshots/company.png)

---

## 📂 Ledger Groups

Features

- Create Group
- Edit Group
- Delete Group
- Parent Group Support

### Screenshot

![Ledger Groups](screenshots/ledger-groups.png)

---

## 📒 Ledgers

Features

- Create Ledger
- Update Ledger
- Delete Ledger
- Assign Ledger Group
- Search Ledger

### Screenshot

![Ledgers](screenshots/ledgers.png)

---

## 📁 Stock Groups

Features

- Create Stock Group
- Edit Stock Group
- Delete Stock Group

### Screenshot

![Stock Groups](screenshots/stock-groups.png)

---

## 📏 Units

Features

- Create Unit
- Edit Unit
- Delete Unit

### Screenshot

![Units](screenshots/units.png)

---

## 📦 Stock Items

Features

- Product Name
- SKU
- Purchase Price
- Selling Price
- GST
- Quantity
- Stock Group
- Unit

### Screenshot

![Stock Items](screenshots/stock-items.png)

---

## 💳 Payment Voucher

Features

- Voucher Number
- Date
- From Ledger
- To Ledger
- Amount
- Narration

### Screenshot

![Payment Voucher](screenshots/payment-voucher.png)

---

## 💰 Receipt Voucher

Features

- Receipt Number
- Date
- Customer Ledger
- Cash Ledger
- Amount
- Narration

### Screenshot

![Receipt Voucher](screenshots/receipt-voucher.png)

---

## 📘 Journal Voucher

Features

- Debit Ledger
- Credit Ledger
- Amount
- Narration

### Screenshot

![Journal Voucher](screenshots/journal-voucher.png)

---

## 🛒 Purchase Voucher

Features

- Supplier
- Purchase Date
- Stock Items
- GST
- Quantity
- Total Amount

### Screenshot

![Purchase Voucher](screenshots/purchase-voucher.png)

---

## 🧾 Sales Voucher

Features

- Customer
- Products
- Quantity
- GST
- Total Amount

### Screenshot

![Sales Voucher](screenshots/sales-voucher.png)

---

## ⌨ Keyboard Shortcut Panel

Features

- Company Selection
- Financial Year
- Calculator
- Voucher Navigation
- Home
- Command Search

### Screenshot

![Keyboard Shortcuts](screenshots/keyboard-shortcuts.png)

---

# 🛠 Technology Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL

## Authentication

- JWT
- bcrypt.js

---

# 📂 Folder Structure

```
SmartERP/
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── components/
│   ├── hooks/
│   ├── config/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── screenshots/
│
├── README.md
│
└── LICENSE
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/SmartERP.git
```

Go inside the project

```bash
cd SmartERP
```

Install frontend dependencies

```bash
cd frontend
npm install
```

Install backend dependencies

```bash
cd ../backend
npm install
```

---

# 🔑 Environment Variables

Backend

```
PORT=5000

DATABASE_URL=your_postgresql_database

JWT_SECRET=your_secret_key
```

Frontend

```
NEXT_PUBLIC_API_URL=https://your-backend-url
```

---

# ▶ Running the Project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

| Module | Screenshot |
|----------|------------|
| Login | login.png |
| Dashboard | dashboard.png |
| Company | company.png |
| Ledgers | ledgers.png |
| Stock Items | stock-items.png |
| Payment Voucher | payment-voucher.png |
| Receipt Voucher | receipt-voucher.png |
| Journal Voucher | journal-voucher.png |

---

# 🚀 Future Scope

- GST Invoice Generation
- Profit & Loss Report
- Balance Sheet
- Barcode Scanner
- Role Based Authentication
- Cloud Backup
- Mobile Application
- AI Business Analytics

---

# 👨‍💻 Author

**Shaurya Aggarwal**

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

Email: your@email.com

---

⭐ If you like this project, don't forget to star this repository.
