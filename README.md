📄 SmartERP – Business Management System
Project Overview

SmartERP is a web-based Enterprise Resource Planning (ERP) application developed to simplify accounting and inventory management for small and medium-sized businesses.

The platform enables business owners to manage companies, ledger groups, ledgers, inventory, vouchers, and business transactions from a centralized dashboard.

The system replaces manual bookkeeping and spreadsheet-based accounting with a secure digital solution that improves efficiency, accuracy, and business decision-making.

Introduction

Many small businesses still rely on paper registers and spreadsheets to maintain accounting records.

Traditional workflows involve:

Manual bookkeeping
Paper vouchers
Excel sheets
Manual inventory tracking
Separate files for different departments

These methods lead to:

Human errors
Duplicate data
Inventory mismatches
Time-consuming accounting
Poor financial reporting

SmartERP provides a centralized web-based ERP solution that digitizes accounting and inventory operations while allowing users to manage their business securely.

Industry Value

SmartERP can be implemented across multiple industries.

Retail Stores
Inventory management
Sales tracking
Customer management
Wholesale Businesses
Supplier management
Purchase tracking
Stock monitoring
Manufacturing
Raw material management
Product inventory
Purchase and sales accounting
Accounting Firms
Multiple company bookkeeping
Financial records
Ledger management
Small & Medium Enterprises
Business accounting
Inventory tracking
Voucher management
Benefits
Centralized accounting
Faster bookkeeping
Reduced paperwork
Better inventory control
Secure business data
Improved financial reporting
Business scalability
Use Cases
Use Case 1: Company Management

Business owners create and manage their companies.

Use Case 2: Ledger Management

Create and maintain:

Customer Ledgers
Supplier Ledgers
Expense Ledgers
Bank Ledgers
Use Case 3: Inventory Management

Manage

Stock Groups
Units
Stock Items
Use Case 4: Voucher Management

Create accounting vouchers including

Payment Voucher
Receipt Voucher
Journal Voucher
Purchase Voucher
Sales Voucher
Use Case 5: Dashboard Monitoring

View business summary including

Total Ledgers
Stock Items
Groups
Units
Stock Groups
User Roles
Business Owner

The business owner can

Register
Login
Create Company
Manage Ledger Groups
Manage Ledgers
Manage Inventory
Create Vouchers
View Dashboard
Logout
Future Roles

The system can be extended with

Administrator
Accountant
Sales Executive
Inventory Manager
System Architecture

Frontend (Next.js + React)

↓

Backend APIs (Node.js + Express)

↓

PostgreSQL Database

Technology Stack
Frontend
Next.js

Purpose

Develop modern web applications with routing and optimized rendering.

Reason for Selection

Fast rendering
Built-in routing
SEO support
High performance
React.js

Purpose

Develop reusable user interface components.

Reason for Selection

Component-based architecture
Fast rendering
Better maintainability
TypeScript

Purpose

Provide static typing and improve code quality.

Reason for Selection

Type safety
Better IntelliSense
Easier debugging
Tailwind CSS

Purpose

Responsive user interface design.

Reason for Selection

Utility-first framework
Faster UI development
Mobile responsive layouts
Backend
Node.js

Purpose

Server-side JavaScript runtime.

Reason for Selection

High performance
Non-blocking architecture
Scalable APIs
Express.js

Purpose

Develop backend REST APIs.

Responsibilities

Authentication APIs
Company APIs
Inventory APIs
Voucher APIs
Dashboard APIs

Reason for Selection

Lightweight
Easy routing
Middleware support
Database
PostgreSQL

Purpose

Stores application data.

Tables include

Users
Companies
Ledger Groups
Ledgers
Stock Groups
Units
Stock Items
Vouchers
Voucher Entries

Reason for Selection

Relational database
ACID compliance
High reliability
Complex SQL queries
Authentication
JWT (JSON Web Token)

Purpose

Secure user authentication.

Reason for Selection

Stateless authentication
Secure API communication
Protected routes
bcrypt.js

Purpose

Encrypt user passwords.

Reason for Selection

Strong password hashing
Improved security
Features
User Registration

Users can

Create account
Store encrypted password
Secure authentication
Screenshot

Insert Registration Page Screenshot

User Login

Users login using

Email
Password

JWT token is generated after successful login.

Screenshot

Insert Login Page Screenshot

Dashboard

Dashboard displays

Total Ledgers
Groups
Stock Groups
Units
Stock Items
Screenshot

Insert Dashboard Screenshot

Company Management

Users can

Create Company
Edit Company
View Company Information
Screenshot

Insert Company Screen Screenshot

Ledger Groups

Users create accounting groups.

Examples

Assets
Liabilities
Expenses
Income
Screenshot

Insert Ledger Group Screenshot

Ledgers

Users manage

Customer Ledgers
Supplier Ledgers
Cash Ledger
Bank Ledger
Screenshot

Insert Ledger Screenshot

Stock Groups

Create inventory categories.

Example

Electronics

↓

Laptops

↓

Gaming Laptops

Screenshot

Insert Stock Group Screenshot

Units

Manage inventory units.

Examples

Piece
Kg
Litre
Box
Screenshot

Insert Units Screenshot

Stock Items

Users can create products by entering

Product Name
SKU
Purchase Price
Selling Price
GST
Quantity
Screenshot

Insert Stock Item Screenshot

Payment Voucher

Records outgoing payments.

Screenshot

Insert Payment Voucher Screenshot

Receipt Voucher

Records incoming payments.

Screenshot

Insert Receipt Voucher Screenshot

Journal Voucher

Creates accounting adjustment entries.

Screenshot

Insert Journal Voucher Screenshot

Purchase Voucher

Records purchases.

Screenshot

Insert Purchase Voucher Screenshot

Sales Voucher

Records customer sales.

Screenshot

Insert Sales Voucher Screenshot

Frontend Folder Structure
smart-erp/
│
├── app/
│   ├── dashboard/
│   ├── billing/
│   ├── company/
│   ├── login/
│   ├── register/
│   ├── masters/
│   ├── voucher/
│   ├── components/
│   ├── hooks/
│   ├── config/
│   └── globals.css
│
├── public/
├── package.json
└── next.config.ts

Frontend Responsibilities

Authentication
Dashboard
Company Management
Inventory UI
Voucher Forms
API Communication
Keyboard Shortcuts
Backend Folder Structure
backend/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── models/
├── database/
├── server.js
└── package.json

Backend Responsibilities

User Authentication
Company Management
Ledger Management
Inventory APIs
Voucher APIs
Dashboard APIs
Database Operations
Challenges Faced
User Authentication
Challenge

Initially, when a new user logged in, previously created company records were visible because companies were not associated with specific users.

Solution

Introduced user_id mapping for companies and ensured that each authenticated user accesses only their own company and related business data.

Dashboard Security
Challenge

Users could attempt to access protected pages directly using URLs.

Solution

Implemented JWT-based authentication and protected routes to restrict unauthorized access.

Data Isolation
Challenge

Different users' business data could overlap if records were not filtered properly.

Solution

Designed APIs to filter records based on the authenticated user's company, ensuring complete data isolation.

Responsive Layout
Challenge

Maintaining a consistent layout with a fixed keyboard shortcuts panel across different screen sizes.

Solution

Implemented responsive layouts using Tailwind CSS with fixed and flexible containers.

Deployment
Challenge

Deploying frontend and backend separately while maintaining API communication.

Solution
Backend deployed independently
Frontend deployed on Vercel
Environment variables configured for API URLs
Future Enhancements
GST Invoice Generation
Financial Reports
Profit & Loss Statement
Balance Sheet
Barcode Scanner
Multi-user Roles
Role-based Permissions
Email Notifications
Cloud Backup
Mobile Application
AI-powered Business Insights
Conclusion

SmartERP is a comprehensive ERP solution designed to simplify business operations through digital accounting and inventory management.

The platform successfully implements

Secure User Authentication
Company Management
Ledger Management
Inventory Management
Voucher Management
Dashboard Analytics
User-specific Business Data

The system improves business efficiency, reduces manual work, minimizes accounting errors, and provides a scalable foundation for future ERP enhancements.
