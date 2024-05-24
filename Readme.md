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
- make

### Installing

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/sts_ecommerce_api.git

cd sts_ecommerce_api.git
```

### Configuration

Create a .env file based on the .env.example file and fill in the necessary keys:

```env
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FIRST_NAME=
LAST_NAME=
USERNAME=
DOB=
PASSWORD=
EMAIL=

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"

JWT_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=

CLOUDINARY_URL=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_STORAGE_FOLDER=

STRIPE_PUBLISHABLE_KEY=pk_test_51PIY8SDm1QPN74Xl34YSnhYeXxJgBBQetgCEkQmxHp1SfUbeCrKyvmKi75b9MFuB0fbxIwWVB218VElHH6FaBIdZ00RwVYLM4v
```

### Running the Application

Install the application:

```bash
make setup
```

Force a reinstall of the application:

```bash
make fresh
```

Run the migrations:

```bash
make migrate
```

Run the seeders:

```bash
make seed
```

The server should now be running on `http://localhost:3000`.

## API Endpoints

### **User Management**

---

### User Registration

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

---

### Full API Documentation

To view the full API documentation, visit `http://localhost:3000/api-docs`.

---

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- Crimson Inc. for the opportunity to develop this project.
- Mentors and peers who provided feedback and guidance.
