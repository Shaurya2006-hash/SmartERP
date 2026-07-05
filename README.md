# 🚀 SmartERP - Business Management System

A full-stack ERP (Enterprise Resource Planning) system developed using **Next.js**, **Node.js**, **Express.js**, and **PostgreSQL** to simplify accounting, inventory management, and voucher management for small and medium-sized businesses.

Frontend Link: https://smart-erp-beige.vercel.app/
Backend Link:https://smarterp-81tq.onrender.com/
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
<img width="1887" height="922" alt="image" src="https://github.com/user-attachments/assets/a76d9460-a90c-4c7c-a233-48d99a032922" />
<img width="1497" height="822" alt="image" src="https://github.com/user-attachments/assets/0225622e-cfee-4567-bc70-3959d3f11fe5" />


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
<img width="1877" height="917" alt="image" src="https://github.com/user-attachments/assets/dc773c24-ab12-40fb-b158-fafe7f605966" />


## 🏢 Company Management

Features

- Create Company
- Edit Company
- Company Details
- GST Number
- Financial Year
- State

### Screenshot
<img width="1571" height="898" alt="image" src="https://github.com/user-attachments/assets/e2be4621-45be-42cf-95c2-5dcac58cd9a5" />
## 📂 Ledger Groups

Features

- Create Group
- Edit Group
- Delete Group
- Parent Group Support

### Screenshot
<img width="1476" height="908" alt="image" src="https://github.com/user-attachments/assets/1f4135d1-ac7d-46ce-96d5-65228add9ae5" />


## 📒 Ledgers

Features

- Create Ledger
- Update Ledger
- Delete Ledger
- Assign Ledger Group
- Search Ledger

### Screenshot

<img width="1505" height="831" alt="image" src="https://github.com/user-attachments/assets/50e7aa4e-9271-491e-848b-241edbcdef15" />

## 📁 Stock Groups

Features

- Create Stock Group
- Edit Stock Group
- Delete Stock Group

### Screenshot
<img width="1508" height="632" alt="image" src="https://github.com/user-attachments/assets/d6479e04-36c5-41d5-a472-158e0c37071c" />

## 📏 Units

Features

- Create Unit
- Edit Unit
- Delete Unit

### Screenshot

<img width="1497" height="846" alt="image" src="https://github.com/user-attachments/assets/8e487564-1ea6-436a-91fd-867e1e55bace" />


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

<img width="1487" height="768" alt="image" src="https://github.com/user-attachments/assets/9d4a0c1f-352b-42ac-8ca8-3fc23245704e" />
## 💳 Payment Voucher

Features

- Voucher Number
- Date
- From Ledger
- To Ledger
- Amount
- Narration

### Screenshot

<img width="1517" height="897" alt="image" src="https://github.com/user-attachments/assets/bbecd5cb-dd38-45dc-910d-98797bb1a93f" />

## 💰 Receipt Voucher

Features

- Receipt Number
- Date
- Customer Ledger
- Cash Ledger
- Amount
- Narration

### Screenshot

<img width="1507" height="827" alt="image" src="https://github.com/user-attachments/assets/ca1d0e7c-5f67-43d3-b3a1-d891a591962e" />


## 📘 Journal Voucher

Features

- Debit Ledger
- Credit Ledger
- Amount
- Narration

### Screenshot

<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/3e992545-756c-4e6d-a5f3-0778cbda7ef8" />

## 🛒 Purchase Voucher

Features

- Supplier
- Purchase Date
- Stock Items
- GST
- Quantity
- Total Amount

### Screenshot
<img width="1545" height="897" alt="image" src="https://github.com/user-attachments/assets/aeb3815d-a29e-44b8-b1fe-4af3e7d2e334" />

## 🧾 Sales Voucher

Features

- Customer
- Products
- Quantity
- GST
- Total Amount

### Screenshot

<img width="1530" height="636" alt="image" src="https://github.com/user-attachments/assets/452442f3-688c-4487-b758-07341d9fb0fa" />

## ⌨ Keyboard Shortcut Panel

Features

- Company Selection
- Financial Year
- Calculator
- Voucher Navigation
- Home
- Command Search

### Screenshot

<img width="396" height="920" alt="image" src="https://github.com/user-attachments/assets/1cb842fb-c6c9-4ac1-af63-c88aab07d378" />


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
│
├── README.md
│

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

GitHub: https://github.com/Shaurya2006-hash/SmartERP

---

⭐ If you like this project, don't forget to star this repository.
