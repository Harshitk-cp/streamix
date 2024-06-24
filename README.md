# Streamix Client

This project is a Next.js Live Vido Streaming application that uses Clerk for user management, Prisma and PostgreSQL for database, and a miniature [LiveKit](https://github.com/Harshitk-cp/rtmp_server)
 for real-time audio and video streaming service.

## Setup

1. **Clone the repository to your local machine:**

   ```zsh
   git clone https://github.com/your-username/your-repository.git
   cd your-repository

2. Create a .env file in the root of the client directory with the following variables:

   ```zsh
   CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
   STREAMIX_WEBSOCKET_URL=<your-streamix-websocket-url>
   STREAMIX_API_URL=<your-streamix-api-url>
   DATABASE_URL=<your-database-url>

