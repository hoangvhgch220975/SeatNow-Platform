# SeatNow - Restaurant Booking System

SeatNow is a high-performance, microservices-based restaurant booking platform designed to provide a seamless experience for customers, restaurant owners, and administrators.

## 🚀 Architecture Overview

The project is built using a modern microservices architecture, ensuring scalability, maintainability, and high availability.

### Backend Services (Microservices)
Located in the `Final Project BE/` directory:

- **Gateway (`SeatNow.GateWay`)**: Built with .NET Core and Ocelot, serving as the single entry point for all client requests.
- **Auth Service (`auth_service`)**: Handles user authentication, authorization, and security (Firebase integration, JWT, OTP via Twilio).
- **User Service (`user_service`)**: Manages user profiles, wallets, and personal information.
- **Restaurant Service (`restaurant-service`)**: Manages restaurant listings, menus, and workspace configurations.
- **Booking Service (`booking-service`)**: Handles the core logic for table reservations and availability.
- **Payment Service (`payment-service`)**: Processes transactions, deposits, and withdrawal requests.
- **Admin Service (`admin-service`)**: Administrative dashboard backend for system monitoring and data management.
- **Notification Service (`notification-service`)**: Real-time notifications via WebSockets and email.
- **AI Service (`AI-service`)**: Python-based service (FastAPI) for intelligent recommendations and data analysis.
- **Promotion Service (`promotion_service`)**: Manages discounts, vouchers, and marketing campaigns.

### Frontend Application
Located in the `Final Project FE/frontend/` directory:

- **SeatNow Web App**: A responsive React application built with Vite, Tailwind CSS, and TanStack Query, offering specialized interfaces for Customers, Owners, and Admins.

## 🛠️ Tech Stack

- **Backend**: Node.js (Express), Python (FastAPI), .NET Core.
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons.
- **Database**: MS SQL Server (Primary), Redis (Caching/Sessions).
- **Other Integrations**: Firebase (Auth/Storage), Cloudinary (Images), Twilio (SMS), Nodemailer (Email).

## 🏃 How to Run

### Prerequisites
- Node.js & npm
- Python 3.x (for AI service)
- .NET SDK (for Gateway)
- MS SQL Server & Redis instances

### Starting the Backend
We provide a convenient utility script to start all microservices simultaneously:

1. Navigate to the backend directory:
   ```powershell
   cd "Final Project BE"
   ```
2. Start all services:
   ```bash
   node run_all_console.js
   ```

### Starting the Frontend
1. Navigate to the frontend directory:
   ```powershell
   cd "Final Project FE/frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

## 🧪 Testing

- **Postman Collections**: Each backend service contains a `script/Postman` or `scripts/Postman` directory with pre-configured API collections for testing.
- **Environment**: Ensure `.env` files are correctly configured in each service directory before running.

---
*Created as part of the SeatNow Final Project.*
