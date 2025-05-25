# Communication_LTD Information System - **INTENTIONALLY VULNERABLE VERSION**

⚠️ **WARNING: This is an intentionally vulnerable application for educational and demonstration purposes only. DO NOT deploy this to production!** ⚠️

A web-based information system for Communication_LTD, built with Node.js, Express, React, and MySQL. This version contains deliberate security vulnerabilities to demonstrate common web application security issues.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
communication-ltd/
├── backend/           # Node.js + Express server
├── frontend/          # React client
└── package.json       # Root package.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Create `.env` file in the frontend directory
4. Set up MySQL database (see backend/README.md for details)
5. Start the development servers:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000

## Intentional Security Vulnerabilities

This application contains the following **intentional vulnerabilities** for educational purposes:

### 🚨 SQL Injection Vulnerabilities
- **Location**: `backend/src/controllers/authController.js`, `backend/src/controllers/customerController.js`, `backend/src/controllers/customers.js`
- **Issue**: Direct string concatenation in SQL queries instead of parameterized queries
- **Examples**:
  - User registration: `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`
  - Customer creation: `INSERT INTO customers (name, sector) VALUES ('${name}', '${sector}')`
- **Additional Risk**: `multipleStatements: true` enabled in database configuration
- **How to exploit**: Try injecting SQL payloads in form inputs

### 🚨 Cross-Site Scripting (XSS) Vulnerabilities
- **Location**: `frontend/src/pages/CustomerManagementPage.js` line 150
- **Issue**: Using `dangerouslySetInnerHTML` without sanitization
- **Code**: `<Typography dangerouslySetInnerHTML={{ __html: customer.name }} />`
- **How to exploit**: Add a customer with name: `<script>alert('XSS!')</script>`

### 🚨 Input Validation Bypass
- **Location**: `frontend/src/utils/validation.js`, `frontend/src/utils/sanitize.js`
- **Issue**: All validation and sanitization functions are pass-through (do nothing)
- **Impact**: No client-side protection against malicious input

### 🚨 Insecure Password Reset
- **Location**: `backend/src/controllers/authController.js` line 174-184
- **Issue**: Password reset tokens are logged to console in plain text
- **Impact**: Tokens exposed in server logs

### 🚨 Information Disclosure
- **Location**: Various debug logging throughout the application
- **Issue**: Sensitive information logged to console including SQL queries and error details
- **Impact**: Information leakage that could aid attackers

## Educational Purpose

This vulnerable version is designed to help developers and security professionals:

1. **Understand common vulnerabilities**: See real examples of SQL injection and XSS
2. **Learn secure coding practices**: Compare vulnerable vs secure implementations
3. **Practice penetration testing**: Use as a safe target for security testing
4. **Security training**: Demonstrate attack vectors and their impacts

## 🔒 Security Best Practices (NOT implemented in this version)

For a secure version, the following should be implemented:

- **SQL Injection Prevention**: Use parameterized queries/prepared statements
- **XSS Protection**: Proper input sanitization and output encoding
- **Input Validation**: Server-side validation of all user inputs
- **Secure Password Reset**: Secure token generation and handling
- **Error Handling**: Generic error messages without sensitive information
- **Rate Limiting**: Prevent brute force attacks
- **HTTPS**: Encrypt all communications
- **Content Security Policy**: Prevent script injection
- **Secure Headers**: Implement security headers

## License

ISC

---

**Remember: This is for educational purposes only. Never deploy vulnerable code to production environments!**
