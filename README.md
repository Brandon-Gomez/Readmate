# Readmate

Readmate is a full-stack book sharing social network built with a Vue frontend and an Express/PostgreSQL backend.

## Tech Stack

- Frontend: Vue 3, Vue Router, Vuex, Axios, Bootstrap
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Storage: Firebase Storage integration

## Main Features

- User authentication
- Book post management
- PDF and image uploads
- User search
- Likes and follows
- Category-based content discovery

## Project Structure

```text
backnode/   Express API
fronvue/    Vue frontend
```

## Local Setup

### Backend

```bash
cd backnode
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd fronvue
npm install
npm run serve
```

## Security Notes

Do not commit real `.env` files, Firebase service account files, database URLs, JWT secrets, or credentials. Use local environment variables and ignored config files.
