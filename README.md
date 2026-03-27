**ERP Purchase Requests API**

This project implements a small ERP-style Purchase Request workflow with role-based access control.

Workflow:

Draft → Submitted → Approved / Rejected

Only authorized roles can perform specific actions.

Setup Instructions
1. Clone the repository
git clone https://github.com/githubusered/erp-api.git
cd erp-api
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the project root.

Example:

DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="supersecretkey"
PORT=4000

4. Run database migrations
npx prisma migrate dev

Generate Prisma client if needed:

npx prisma generate
5. Seed the database

Run:

node seed.js

This will create demo companies and users for testing.

6. Start the server
npm run dev

or

node server.js

The API will run on:

http://localhost:4000

Test Credentials

The seed script creates the following users:

Role	Email	Password	Company
Staff	staff@example.com
	password123	Demo Company A
Manager	manager@example.com
	password123	Demo Company A
Manager	manager@b.com
	password123	Demo Company B
Admin	admin@example.com
	admin123	Demo Company A

These accounts can be used to test authentication and workflow permissions.

Architecture Overview

The project is structured using a modular architecture separating responsibilities between routing, business logic, and infrastructure.

Routes define API endpoints and map them to controllers.
Controllers implement business logic for authentication and purchase request workflows.
Middleware handles authentication, token validation, and role-based access control.
Prisma is used as the ORM for interacting with the PostgreSQL database.

Key design decisions include using JWT for stateless authentication, enforcing role-based permissions, and structuring the codebase to keep controllers independent from routing and database configuration.

Edge Cases Considered
Prevent submitting a request that is not in Draft status.
Prevent approving or rejecting a request that is not Submitted.
Ensure users cannot modify or access purchase requests from another company.
Validate required fields when creating purchase requests.
Reject requests with invalid or missing authentication tokens.

Not yet implemented but possible future improvements:

Pagination for large request lists
Rate limiting for login attempts
Audit logs for workflow actions
Example API Requests

Login
POST /api/auth/login

Example request body:

{
  "email": "staff@example.com",
  "password": "password123"
}

Response includes a JWT token used for authenticated requests.

Create Purchase Request
POST /api/purchase-requests

Header:

Authorization: Bearer <token>

Example body:

{
  "title": "New Laptop",
  "amount": 1500
}
Submit Request
POST /api/purchase-requests/:id/submit
Approve Request
POST /api/purchase-requests/:id/approve

Manager role required.

Reject Request
POST /api/purchase-requests/:id/reject

Manager role required.

Testing

The API can be tested using:

Postman
curl
Insomnia
