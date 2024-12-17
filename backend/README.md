# Blog Platform Backend API

This is the PHP backend API for the Blog Platform application.

## Setup Instructions

1. Database Setup:
   - Create a MySQL database named `blog_db`
   - Import the `database.sql` file to create the required tables
   - Update database credentials in `config/database.php`

2. Server Requirements:
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Apache with mod_rewrite enabled
   - PDO PHP Extension
   - JSON PHP Extension

3. Installation:
   - Place the backend files in your web server directory
   - Ensure the `.htaccess` file is properly configured
   - Update the JWT secret key in `config/JwtHandler.php`

## API Endpoints

### Authentication

1. Register User
   ```
   POST /api/auth/register
   {
     "username": "string",
     "email": "string",
     "password": "string"
   }
   ```

2. Login
   ```
   POST /api/auth/login
   {
     "email": "string",
     "password": "string"
   }
   ```

3. Verify Token
   ```
   GET /api/auth/verify
   Headers: {
     "Authorization": "Bearer {token}"
   }
   ```

## Security

- All passwords are hashed using PHP's password_hash() function
- JWT tokens are used for authentication
- CORS is configured to allow requests from the frontend
- Input sanitization is implemented for all user inputs

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
