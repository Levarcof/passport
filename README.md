# 🛂 PassportEase - Secure Digital Passport Application Platform

PassportEase is a full-stack web application designed to digitize and streamline the traditional passport application process. The platform allows citizens to securely fill out multi-step application forms, upload verified government documentation, and track their application lifecycle in real time through an intuitive, modern dashboard.

---

## 🚀 Core Features

### 📄 Intelligent Multi-Step Application Form
*   **State Management:** Complex multi-page form processing handling personal data, residential history, and emergency contacts with client-side validation.
*   **Draft Auto-Save:** Progressive form-filling that allows users to save draft states and return to complete them later.

### 📁 Secure Document Upload & Management
*   **Multi-Format Support:** Programmatic handling of mandatory digital document uploads (Identity Proof, Address Proof, and Passport Photos).
*   **File Validation:** Strict client-side and server-side evaluation of file sizes and extensions to ensure data integrity.

### 📊 Real-Time Application Lifecycle Tracking
*   **Dynamic Status Dashboard:** A beautiful timeline interface showing live status updates of the application (e.g., *Draft, Submitted, Under Verification, Dispatched, Approved*).
*   **Unique Reference Generation:** Automatic tracking ID compilation upon form submission for quick database queries.

### 🖥️ Admin Control Panel (Internal Utility)
*   *Designed for backend simulation:* Capability for an administrative user to update application statuses, download user documents, and approve or reject submissions.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router)** | Used for server-side rendering (SSR), structural route protection, and optimal Core Web Vitals performance. |
| **Styling** | **Tailwind CSS** | Utilized for a clean, accessible, and responsive user interface resembling modern enterprise portals. |
| **Database** | **MongoDB** | Schema-flexible document repository perfectly suited for complex, nested passport form schemas. |
| **ODM / DB Driver** | **Mongoose** | Used to implement data-modeling, strict schema validation, and optimized population queries. |

---


1. **Clone the Repository**
   ```bash
   git clone [https://github.com/levarcof/passport.git](https://github.com/levarcof/passport.git)
   cd passport
