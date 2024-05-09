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

```

git clone https://github.com/yourusername/sts_ecommerce_api.git

cd sts_ecommerce_api.git

```

### Configuration

Create a .env file based off the .env.example file and add fill the necessary keys

```

DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FIRST_NAME=
LAST_NAME=
USERNAME=
DOB=
PASSWORD=
EMAIL=

JWT_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=

```

### Running the Application

Installing the application

```
make setup
```

Forcing a reinstall of the application

```
make fresh
```

Run the migrations:

```
make migrate
```

Running the seeders:

```
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

### **User Profile**

---

### **Add or Update User Address**

This documentation section outlines the endpoints and functionality related to managing user addresses in the Crimson Backend API:

#### **Endpoint**

`POST /api/v1/user/profile/address`

#### **Description**

Allows users to add or update their delivery address. If the user already has an address, it will be updated; otherwise, a new address will be added to their profile.

#### **Authentication**

Requires authentication.

#### **Request Body**

- `street_address`: The street address of the user's delivery address. Required.
- `city`: The city of the user's delivery address. Required.
- `postal_code`: The postal code of the user's delivery address. Required.
- `country`: The country of the user's delivery address. Required. Must be a string.
- `label`: (Optional) A label for the address (e.g., Home, Work).
- `state`: (Optional) The state of the user's delivery address.

#### **Sample Request**

```json
{
  "street_address": "25 ABC house",
  "city": "Accra",
  "state": "Greater Washington",
  "postal_code": "GH-12356",
  "country": "USA"
}
```

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "data": {
      "address": {
        "id": 1,
        "street_address": "25 ABC house",
        "city": "Accra",
        "state": "Greater Washington",
        "postal_code": "GH-12356",
        "country": "USA"
      }
    },
    "message": "User Address Updated"
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": [
      "Street address is required",
      "City is required",
      "Postal code is required",
      "Country is required",
      "Country must be a string"
    ]
  }
  ```

### **Retrieve User Address**

#### Endpoint

`GET /api/v1/user/profile/address`

#### Description

Retrieves the user's address.

#### Authentication

Requires authentication.

#### Responses

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "data": {
      "address": {
        "id": 1,
        "label": "Billing",
        "street_address": "35 Bibiani street",
        "city": "London",
        "state": "Washington DC",
        "postal_code": "BBQ JJJ",
        "country": "USA"
      }
    },
    "message": "Address retrieved successfully"
  }
  ```

- **Error Response:**

  **Code:** 404 Not Found

  **Content:**

  ```json
  {
    "success": false,
    "error": "User address not found"
  }
  ```

  ### **Update User Password**

#### Endpoint

<!-- `GET /api/v1/user/profile/address` -->

<!-- #### Description

Retrieves the user's address.

#### Authentication

Requires authentication.

#### Responses

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "data": {
      "address": {
        "id": 1,
        "label": "Billing",
        "street_address": "35 Bibiani street",
        "city": "London",
        "state": "Washington DC",
        "postal_code": "BBQ JJJ",
        "country": "USA"
      }
    },
    "message": "Address retrieved successfully"
  }
  ```

- **Error Response:**

  **Code:** 404 Not Found

  **Content:**

  ```json
  {
    "success": false,
    "error": "User address not found"
  }
  ``` -->

### **Update User General Profile**

<!-- #### Endpoint

`GET /api/v1/user/profile/address`

#### Description

Retrieves the user's address.

#### Authentication

Requires authentication.

#### Responses

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "data": {
      "address": {
        "id": 1,
        "label": "Billing",
        "street_address": "35 Bibiani street",
        "city": "London",
        "state": "Washington DC",
        "postal_code": "BBQ JJJ",
        "country": "USA"
      }
    },
    "message": "Address retrieved successfully"
  }
  ```

- **Error Response:**

  **Code:** 404 Not Found

  **Content:**

  ```json
  {
    "success": false,
    "error": "User address not found"
  }
  ``` -->

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

---

## Category Management

### **Store Category**

#### **Endpoint**

`POST /api/v1/categories`

#### **Description**

Creates a new category in the system.

#### **Authentication**

Requires authentication and administrator privileges.

#### **Request Body**

- `name`: The name of the category. Required. Must be unique and not exceed 255 characters.
- `description`: (Optional) Description of the category.

#### **Sample Request**

```json
{
  "name": "Electronics",
  "description": "Category for electronic products"
}
```

#### **Responses**

- **Success Response:**

  **Code:** 201 Created

  **Content:**

  ```json
  {
    "success": true,
    "message": "Category created",
    "data": {
      "category": {
        "id": "82eb4227-3e57-47f6-a9a0-92e975bc8f69",
        "name": "Electronics",
        "description": "Category for electronic products"
      }
    }
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": ["Category name is required."]
  }
  ```

### **Update Category**

#### **Endpoint**

`PUT /api/v1/categories/:id`

#### **Description**

Updates an existing category.

#### **Authentication**

Requires authentication and administrator privileges.

#### **Request Body**

- `name`: The name of the category. Required. Must be unique and not exceed 255 characters.
- `description`: (Optional) Description of the category.

#### **Sample Request**

```json
{
  "name": "Books",
  "description": "Category for books and literature"
}
```

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Category updated",
    "data": {
      "category": {
        "id": "82eb4227-3e57-47f6-a9a0-92e975bc8f69",
        "name": "Books",
        "description": "Category for books and literature"
      }
    }
  }
  ```

- **Error Response:**

  **Code:** 400 Bad Request

  **Content:**

  ```json
  {
    "success": false,
    "error": ["Name must not exceed 255 characters."]
  }
  ```

### **Delete Category**

#### **Endpoint**

`DELETE /api/v1/categories/:id`

#### **Description**

Deletes an existing category.

#### **Authentication**

Requires authentication and administrator privileges.

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Category deleted successfully",
    "data": true
  }
  ```

- **Error Response:**

  **Code:** 403 Forbidden

  **Content:**

  ```json
  {
    "success": false,
    "error": "Category cannot be deleted as it has associated products"
  }
  ```

### **Get Categories**

#### **Endpoint**

`GET /api/v1/categories`

#### **Description**

Retrieves all categories from the system.

#### **Authentication**

Requires authentication.

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Categories retrieved successfully",
    "data": {
      "categories": [
        {
          "id": "1",
          "name": "Electronics",
          "description": "Category for electronic products"
        },
        {
          "id": "2",
          "name": "Books",
          "description": "Category for books and literature"
        }
      ]
    }
  }
  ```

### **Get Category by ID**

#### **Endpoint**

`GET /api/v1/categories/:id`

#### **Description**

Retrieves a single category by its ID.

#### **Authentication**

Requires authentication.

#### **Responses**

- **Success Response:**

  **Code:** 200 OK

  **Content:**

  ```json
  {
    "success": true,
    "message": "Category retrieved successfully",
    "data": {
      "category": {
        "id": "1",
        "name": "Electronics",
        "description": "Category for electronic products"
      }
    }
  }
  ```

- **Error Response:**

  **Code:** 404 Not Found

  **Content:**

  ```json
  {
    "success": false,
    "error": "Category not found"
  }
  ```

---

Sure, here's a continuation of your README with the sections you requested:

### Product Interaction

#### Viewing Products

- **Endpoint**: `GET /api/products`
- **Description**: Retrieves all products available in the platform.
- **Authentication**: Not required.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: JSON array of product objects.
  - **Error Response**:
    - **Code**: 500 Internal Server Error
    - **Content**: Error message indicating server failure.

#### Sorting

- **Endpoint**: `GET /api/products?sort=<attribute>`
- **Description**: Sorts products based on the specified attribute (e.g., price, name).
- **Authentication**: Not required.
- **Parameters**:
  - `sort`: The attribute to sort the products by.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: JSON array of sorted product objects.
  - **Error Response**:
    - **Code**: 400 Bad Request
    - **Content**: Error message indicating invalid sort attribute.

#### Searching

- **Endpoint**: `GET /api/products?search=<keywords>`
- **Description**: Searches for products based on the provided keywords.
- **Authentication**: Not required.
- **Parameters**:
  - `search`: Keywords to search for in product names or descriptions.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: JSON array of product objects matching the search criteria.
  - **Error Response**:
    - **Code**: 400 Bad Request
    - **Content**: Error message indicating invalid search query.

#### Adding to Cart

- **Endpoint**: `POST /api/cart/add`
- **Description**: Adds a product to the user's shopping cart.
- **Authentication**: Required.
- **Request Body**:
  - `product_id`: The ID of the product to add to the cart.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming product added to cart.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating product not found.

#### Adding to Wishlist

- **Endpoint**: `POST /api/wishlist/add`
- **Description**: Adds a product to the user's wishlist for future consideration.
- **Authentication**: Required.
- **Request Body**:
  - `product_id`: The ID of the product to add to the wishlist.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming product added to wishlist.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating product not found.

### Order Management

#### Placing Orders

- **Endpoint**: `POST /api/orders`
- **Description**: Places an order for the products in the user's cart.
- **Authentication**: Required.
- **Request Body**:
  - List of product IDs and quantities.
- **Responses**:
  - **Success Response**:
    - **Code**: 201 Created
    - **Content**: Order details including order ID and total amount.
  - **Error Response**:
    - **Code**: 400 Bad Request
    - **Content**: Error message indicating invalid order request.

#### Canceling Orders

- **Endpoint**: `DELETE /api/orders/:order_id`
- **Description**: Cancels the specified order.
- **Authentication**: Required.
- **Parameters**:
  - `order_id`: The ID of the order to cancel.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming order cancellation.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating order not found.

#### Managing Delivery Addresses

- **Endpoint**: `POST /api/orders/:order_id/address`
- **Description**: Updates the delivery address for the specified order.
- **Authentication**: Required.
- **Parameters**:
  - `order_id`: The ID of the order to update the delivery address for.
- **Request Body**:
  - New delivery address details.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming address update.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating order not found.

### Admin Functions

#### Adding Products

- **Endpoint**: `POST /api/admin/products`
- **Description**: Allows administrators to add new products to the platform.
- **Authentication**: Required, administrator privileges.
- **Request Body**:
  - Details of the new product (name, description, price, etc.).
- **Responses**:
  - **Success Response**:
    - **Code**: 201 Created
    - **Content**: Success message confirming product addition.
  - **Error Response**:
    - **Code**: 400 Bad Request
    - **Content**: Error message indicating invalid product data.

#### Categorizing Products

- **Endpoint**: `POST /api/admin/products/:product_id/category`
- **Description**: Assigns a category to the specified product.
- **Authentication**: Required, administrator privileges.
- **Parameters**:
  - `product_id`: The ID of the product to categorize.
- **Request Body**:
  - Category ID or name to assign to the product.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming product categorization.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating product or category not found.

#### Managing User Accounts

- **Endpoint**: `PUT /api/admin/users/:user_id`
- **Description**: Allows administrators to update user account details.
- **Authentication**: Required, administrator privileges.
- **Parameters**:
  - `user_id`: The ID of the user to update.
- **Request Body**:
  - New user account details (e.g., username, email, password).
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: Success message confirming user account update.
  - **Error Response**:
    - **Code**: 404 Not Found
    - **Content**: Error message indicating user not found or invalid update request.

#### Managing Orders

- **Endpoint**: `GET /api/admin/orders`
- **Description**: Retrieves all orders for administrative purposes.
- **Authentication**: Required, administrator privileges.
- **Responses**:
  - **Success Response**:
    - **Code**: 200 OK
    - **Content**: JSON array of order objects.
  - **Error Response**:
    - **Code**: 500 Internal Server Error
    - **Content**: Error message indicating server failure.

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
