<div align="center">

# 🚀 Kale HQ Retention Stack Backend

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-success.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-blue.svg)](https://expressjs.com/)
[![Azure](https://img.shields.io/badge/Azure-Integrated-0089D6.svg)](https://azure.microsoft.com/)

A powerful API designed for managing client retention through advanced features like email enrichment, persona configurations, and third-party integrations.

</div>

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [📖 Documentation](#-documentation)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [🔐 Environment Variables](#-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🛠️ Technologies Used](#️-technologies-used)
- [📜 Scripts](#-scripts)
- [📄 License](#-license)

## 📖 Documentation

Comprehensive documentation is available in the `Docs` folder.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **MongoDB**: Running instance
- **Environment Variables**: Configured as described below

### Installation

1. Clone the repository:
   ```bash
   git clone link_of_repo
   ```

2. Navigate to project directory:
   ```bash
   cd to_directory
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

1. **Start MongoDB**: Ensure your MongoDB server is running
2. **Launch the application**:
   ```bash
   # Development mode with hot reloading
   npm run dev

   # Production mode
   npm start
   ```
3. Access the server at `http://localhost:5500`

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Application Details
PORT=5500
WEB_WORKER_BASE_URL=http://localhost:3000

# MongoDB Details
MONGO_URI=mongoDB_url
DB_NAME=your_DB_NAME

# Azure Key Vault Details
AZURE_CLIENT_SECRET=Client_secret
AZURE_CLIENT_ID=Client_ID
AZURE_TENANT_ID=Tenant_ID
KEY_VAULT_NAME=key_vault_name

# Azure Blob Storage Details
AZURE_STORAGE_ACCOUNT_NAME=Blob_storage_name
AZURE_STORAGE_CONNECTION_STRING=Connection_string
AZURE_STORAGE_KEY=storage_key

# Azure Email Sending Service
AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=connection_string

# WorkOS Details
WORKOS_API_KEY=api_key_of_workos
WORKOS_CLIENT_ID=client_id_of_workos
WORKOS_VERIFY_TOKEN_KEY_ID=token_id_verify_token
SIGNUP_URL=redirect_url_for_signup
LOGIN_URL=redirect_url_for_login
```

> 💡 **Note:** Replace placeholder values with actual credentials

## 📂 Project Structure

```
.
├── app.js                 # Application entry point
├── config/               # Configuration files
├── controllers/          # Route handlers
├── Docs/                # Project documentation
├── middlewares/         # Middleware functions
├── models/              # MongoDB schemas
├── services/            # Business logic & integrations
├── storage/             # File storage utilities
├── utils/               # Utility functions
├── views/               # Views for rendering
├── tests/               # Test cases
├── package.json         # Project metadata & dependencies
└── .env                 # Environment variables
```

## 🛠️ Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Joi
- **Job Scheduler**: node-cron
- **Third-Party Integrations**:
  - Azure Services (Blob Storage, Key Vault, Email)
  - Slack
  - Stripe
  - WorkOS
- **Environment Management**: dotenv

## 📜 Scripts

```bash
# Development mode with hot reloading
npm run dev

# Production mode
npm start

# Run tests
npm test
```

---

<div align="center">
Made with ❤️ by the Kale HQ Team
</div>
