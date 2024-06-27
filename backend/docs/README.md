# Shopping Platform API

## Overview

This is the backend API for the Shopping Platfrom. It provide functionalities such like managing Users, Products, Orders, Carts, Wishlists, Payments, Reviews and Returns. API is built using Node.js, Express and MySQL

## Contents

- [Setup](#setup)
  - [Enviorenment Varibles](#enviorenment-varibles)
- [API Endpoints](#api-endpoints)
- [Logging](#logging)

## Setup

1. Clone git repository:

   ```sh
   git clone https://github.com/Kornellen/shopping-platform.git
   cd shopping-platform/backend/server
   ```

2. Install dependencies:

   ```sh
       npm install
   ```

3. ### Enviorenment Varibles

   Make sure to create `.env` file in the root folder of backend. Required Values:

   ```dotenv
    DB_USER="your_db_user"
    DB_USER_PASSWORD="your_db_user_password"
    EMAIL_ADDRESS="your_email_for_sending_emails (only gmail)"
    EMAIL_PASSWORD="app_password_for_email"

   ```

4. Start server

   ```sh
    npm start
   ```

## API Endpoints

### User

1. Creating User Account:

   The Create User endpoint is a POST request used to create a new user with the provided details.

   **Endpoint**: [http://localhost:5174/api/createuser](http://localhost:5174/api/createuser)

   **Request Body**

   ```txt
   username (string, required): The username of the user.
   email (string, required): The email address of the user.
   password (string, required): The password for the user account.
   firstName (string, required): The first name of the user.
   lastName (string, required): The last name of the user.
   phoneNumber (string, required): The phone number of the user.
   dob (string, required): The date of birth of the user.
   gender (string, required): The gender of the user.
   ```

   **Response (JSON Schema)**

   ```JSON

   {
    "type": "object",
    "properties": {
        "userId": {
            "type": "string"
        },
        "message": {
            "type": "string"
        }
    }
   }
   ```

2. Login:

   This API endpoint is used to authenticate a user by providing their username and password.

   **Request**

   **Method**: POST

   **Endpoint**: [http://localhost:5174/api/login](http://localhost:5174/api/login)

   **Headers**:
   Content-Type: application/json

   **Body:**

   ```JSON
   {
       "username": "",
       "password": ""
   }
   ```

   **Response**

   The response for this request is a JSON object with the following schema:

   ```JSON
   {
       "type": "object",
       "properties": {
           "token": {
               "type": "string"
           }
       }
   }
   ```

   The response contains a token which can be used for further authenticated requests.

## Logging
