# Crimson Backend

## Overview

Crimson Backend is an API for a new e-commerce platform developed for Crimson Inc. This project serves as a demonstration of the skills and knowledge acquired over the past three months. The API will facilitate user interactions with the platform, such as registration, authentication, and management of products and user activities.

## Features

- **User Management**: Registration, authentication, profile updates, password resets.
- **Product Interaction**: Viewing, sorting, searching, adding to cart and wishlist.
- **Order Management**: Placing orders, canceling orders, managing delivery addresses.
- **Admin Functions**: Adding products, categorizing products, managing user accounts and orders.

## Technologies Used

- **Node.js**: Runtime environment for executing JavaScript code server-side.
- **Express**: Framework for building web applications and APIs.
- **MySQL**: Relational database management system.
- **Sequelize**: Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

## Getting Started

### Prerequisites

- Docker

### Installing

Clone the repository to your local machine:

```

git clone https://github.com/yourusername/crimson-backend.git
cd crimson-backend

```

Install the necessary packages:

```

npm install

```

### Configuration

Create a `.env` file in the root directory and add the following environment variables:

```

DB_NAME=crimsondb
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_HOST=localhost
PORT=5000
SECRET_KEY=your_secret_key_for_jwt

```

Update `config/config.json` with your database credentials for Sequelize:

```json
{
  "development": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "crimsondb",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### Running the Application

Run the migrations:

```
npx sequelize db:migrate
```

Start the server:

```
npm start
```

The server should now be running on `http://localhost:5000`.

## API Endpoints

### **User Registration**

#### **Endpoint**

`POST /api/v1/auth/register`

#### **Description**

Registers a new user on the Crimson Inc. platform. This endpoint validates user input and creates a new user account if the validation succeeds.

#### **Request Body**

- `first_name`: The user's first name. Required. Must be a string.
- `last_name`: The user's last name. Required. Must be a string.
- `dob`: The user's date of birth in the format YYYY-MM-DD. The user must be at least 18 years old.
- `username`: A unique username for the user. Required. Must be alphanumeric and 5-20 characters long.
- `password`: A password for the user's account. Required. Must be at least 8 characters long and include one number, one lowercase letter, one uppercase letter, and one special character. Cannot contain spaces.
- `password_confirmation`: A confirmation of the password. Required. Must match the password.
- `email`: The user's email address. Required. Must be a valid email address from the domain `example.com` and must not be longer than 254 characters. Cannot contain special characters like `/`, `\`, `<`, `>`, `&`.

#### **Sample Request**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1980-04-05",
  "username": "johndoe2024",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!",
  "email": "johndoe@example.com"
}
```

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "82eb4227-3e57-47f6-a9a0-92e975bc8f69",
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe2024",
        "email": "johndoe@example.com",
        "dob": "1980-04-05",
        "image_url": "/images/user.jpeg",
        "is_admin": false,
        "is_suspended": false
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyZWI0MjI3LTNlNTctNDdmNi1hOWEwLTkyZTk3NWJjOGY2OSIsInVzZXJuYW1lIjoidXNlcjciLCJpc19hZG1pbiI6ZmFsc2UsImlzX3N1c3BlbmRlZCI6ZmFsc2UsImlhdCI6MTcxNTAwNjY5MSwiZXhwIjoxNzE1MDA3NTkxfQ.2Cjv7mv2M8in5DDv2dIbQ1duSqzQrU5uBpNUXiSdVQc",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyZWI0MjI3LTNlNTctNDdmNi1hOWEwLTkyZTk3NWJjOGY2OSIsImlhdCI6MTcxNTAwNjY5MSwiZXhwIjoxNzE1MDkzMDkxfQ.Jyz3chXLDnBTjuq9sq49YLxrnS3YwJl1sZSdY9_mHwI"
    }
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": [
      "First name (first_name) is required.",
      "Username (username) is required.",
      "Username (username) must be alphanumeric.",
      "Username (username) must be between 5 and 20 characters long."
    ]
  }
  ```

  **OR**

  **Code:** 409 Conflict

  **Content:**

  ```json
  {
    "success": false,
    "error": "Username already exists"
  }
  ```

---

### **User Login**

#### **Endpoint**

`POST /api/v1/auth/login`

#### **Description**

Authenticates a user by verifying their username and password, and returns an access token along with a refresh token if the credentials are valid.

#### **Request Body**

- `username`: The username of the user. Required.
- `password`: The password associated with the user's account. Required.

#### **Sample Request**

```json
{
  "username": "user7",
  "password": "SecurePassword123!"
}
```

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "82eb4227-3e57-47f6-a9a0-92e975bc8f69",
        "first_name": "Kwesi",
        "last_name": "Kwesi",
        "username": "user7",
        "email": "kwesi7@example.com",
        "dob": "1990-01-07",
        "image_url": "/images/user.jpeg",
        "is_admin": false,
        "is_suspended": false
      },
      "accessToken": "<access-token>",
      "refreshToken": "<refresh-token>"
    }
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": ["Username (username) is required."]
  }
  ```

### **User Logout**

#### **Endpoint**

`POST /api/v1/auth/logout`

#### **Description**

Logs out a user by invalidating the user's current access token.

#### **Authentication**

Requires an `Authorization` header with a valid Bearer token.

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Logout successful",
    "data": true
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": "Logout Failed"
  }
  ```

#### **Notes**

- The `accessToken` provided on login is required to be sent in the `Authorization` header as a Bearer token for logging out.
- Refresh tokens are managed in a way that supports token rotation and limits the lifespan of refresh tokens to reduce security risks.

These sections outline how users interact with the login and logout functionalities, providing clear instructions and responses for API consumers.

- PUT `/api/users/update` - Update user profile
- POST `/api/users/reset-password` - Reset password
- PUT `/api/users/address` - Add/update delivery address
- DELETE `/api/users` - Delete user account

---

## Token Management

### Refreshing Access Tokens

**Endpoint: POST `/api/v1/auth/refresh-token`**

- **Purpose**: Allows users to refresh their expired access tokens using a valid refresh token.
- **Authorization**: No authorization is required to access this endpoint as it is specifically for renewing access tokens.

#### **Request Body**

- `refresh_token`: A string representing the refresh token. Required

#### Successful Response:

A successful request returns a JSON object containing a new access token and refresh token. The response indicates that the user can continue to interact with the API using the new access token.

```json
{
  "success": true,
  "data": {
    "accessToken": "<new_access_token>",
    "refreshToken": "<new_refresh_token>"
  },
  "message": "Token generated successfully."
}
```

#### Error Response:

If the provided refresh token is invalid, missing, or has expired, the API returns an error response. This response indicates that the user must log in again or provide a valid refresh token to continue.

```json
{
  "success": false,
  "error": "Invalid refresh token"
}
```

### Product Interaction

- GET `/api/products` - View all products
- GET `/api/products?search=keywords` - Search for products
- GET `/api/products?sort=price` - Sort products by price
- POST `/api/cart/add` - Add product to cart
- DELETE `/api/cart/remove` - Remove product from cart
- POST `/api/orders` - Place an order
- DELETE `/api/orders/cancel` - Cancel an order

### Admin Functions

- POST `/api/admin/products` - Add new products
- PUT `/api/admin/products/:id` - Update product details
- DELETE `/api/admin/users/:id/suspend` - Suspend user account

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- Crimson Inc. for the opportunity to develop this project.
- Mentors and peers who provided feedback and guidance.

```

```
