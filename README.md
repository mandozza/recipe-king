# Recipe King

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Recipe King is a web application that allows users to create, view, and share recipes. Users can create an account and log in using Google, GitHub, or their own credentials. Once logged in, users can create new recipes, view all recipes, and favorite their preferred recipes. The application uses MongoDB to store user data and recipes, while AWS S3 is utilized for storing images of recipes and user profile pictures.

The purpose of this project is to break free from "tutorial hell" by building a simple recipe-sharing app. This project is a work in progress and will be updated with new features and improvements.

## Tech Stack

-   MongoDB
-   Mongoose
-   Shadcn UI
-   Next.js
-   TypeScript
-   NextAuth
-   AWS S3
-   Tailwind CSS

## Getting Started

To get started, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

The project uses the following environment variables, defined in `.env.local`:

```bash
S3_ACCESS_KEY="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-access-key"
S3_BUCKET_NAME="your-bucket-name"
S3_HOSTNAME="your-bucket-hostname"
MONGO_URI="your-mongodb-uri"
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

## Seeding the Database

To seed the database, run the following command:

```bash
npm run seed
```

## Authentication

The project uses NextAuth for authentication with Google and GitHub providers and also supports credential login. Ensure you have the correct environment variables set for authentication.

## Scripts

```bash
dev: Runs the development server.
build: Builds the application for production.
start: Starts the production server.
lint: Runs ESLint.
seed: Seeds the database.
```

## Notes on the Project

Currently, this project is a work in progress. The following features are implemented:

-   [x] Users can create a new account.
-   [x] Users can log in with Google, GitHub, or their credentials.
-   [x] Users can favorite recipes.

## Upcoming Features

-   [ ] Users can upload a profile picture.
-   [ ] Users can upload images of recipes.
-   [ ] Users can view their profile.
-   [ ] Users can edit their profile.
-   [ ] Users can edit their recipes.
-   [ ] Users can delete their recipes.
-   [ ] Users can search for recipes.
-   [ ] Users can filter recipes by category.
-   [ ] Users can view their favorite recipes.
