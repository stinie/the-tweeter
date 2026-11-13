# Tweeter

A backend challenge built by Christine Fürst with Node.js, Express, MongoDB and EJS.

Users register and log in to view tweets. Logged-in users can create tweets and edit or delete their own. Authentication uses bcrypt password hashing and a JWT stored in an HTTP-only cookie.

## Requirements

- Node.js 24 LTS and npm.
- A MongoDB connection URI with permission to access the database.

## Installation

From the project folder:

```bash
npm install
cp .env.example .env
```

In `.env`, set:

- `MONGODB_URI`: your complete MongoDB connection URI, including credentials if required. The app uses the database `backend_challenge_user` —a naming souvenir from challenge day. 😅
- `JWT_SECRET`: your own long, random signing secret.
- `PORT`: `3000` by default.
- `NODE_ENV`: `development` for local use.

The current database connection reads `MONGODB_URI` directly.

Keep `.env` private and excluded from Git.

## Run

```bash
npm start
```

Or run with automatic restarts during development:

```bash
npm run dev
```

Open http://localhost:3000 and register an account, then log in.

## Validation

Creating and updating tweets both use server-side model validation:

- Title: required, at least 21 characters.
- Tweet: required, at most 50 characters.
- Spaces-only fields are rejected.

## Dependencies

- Express: routes and request handling.
- EJS: page templates.
- Mongoose: MongoDB models and validation.
- bcrypt: password hashing.
- jsonwebtoken: JWT authentication.
- cookie-parser: reading cookies.
- Morgan: request logging.
- Nodemon: automatic restarts during development.
