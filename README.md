# 🏛️  Judicial Database Management System (JDMS)

## 📌 Overview
The **Judicial Database Management System (IJDMS)** is a centralized, web-based platform designed to digitize and streamline judicial case management across courts in India.  
The system replaces manual paper-based processes with a secure, efficient, and transparent solution for judges, lawyers, court staff, and administrators.

---

## 🎯 Objectives
- 📂 Eliminate manual case record-keeping  
- 🔐 Improve data accessibility for authorized users  
- ⚖️ Automate workflows: case registration, hearings, judgment recording  
- 📊 Enable transparency & judicial data insights with dashboards  

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | React.js, Tailwind CSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** |  MySQL |
| **Authentication** | JWT, bcrypt |
| **Version Control** | Git & GitHub |

---

## ✅ Key Features
### 📁 Case Management
- Register cases with unique Case IDs  
- Track case lifecycle from filing → hearings → judgment  

### 🏛️ Court & Judge Module
- Store court details & judge assignments  
- Maintain jurisdiction information  

### 👨‍⚖️ Litigant & Lawyer Records
- Manage litigant & lawyer profiles  
- Map representation per case  

### 🕓 Hearing Management
- Schedule & log hearings  
- Track orders and updates  

### 📜 Judgment Tracking
- One-to-one case-to-judgment mapping  
- Store verdict, date, and decision summary  

### 📈 Dashboard
- Analytics based on case types, status, timelines  

---

## 🏗️ Installation & Setup

### 📎 Prerequisites
- Node.js & npm  
- MySQL / PostgreSQL  
- Git installed  

### ⚙️ Steps

```bash
# Clone the repository
git clone https://github.com/<your-username>/Indian-Judicial-Database-Management-System.git
cd Indian-Judicial-Database-Management-System

# Backend Setup
cd backend
npm install
npm start

# Frontend Setup
cd ../frontend
npm install
npm run dev
