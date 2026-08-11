# Real Estates

## Project Overview

Full-stack Real Estate platform with a Vite + React frontend and an Express + Node.js backend. Includes user authentication, property listings, inquiries, wishlist and chat features.

## Main Features
- User authentication (register, login, verify email)
- Property management (add/edit/delete, image upload to Cloudinary)
- Inquiries and contact form (emails sent via Brevo)
- Wishlist and user profiles
- Real-time chat via Socket.IO

## Technologies
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (Atlas)
- Auth: JWT
- File storage: Cloudinary
- Email: Brevo (SMTP/REST)

## Folder Structure
- `client/` — React frontend
- `server/` — Express backend

## Environment Variables
Create a `.env` in the project root (do NOT commit). See `.env.example` for required variables. Key variables:
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `BREVO_API_KEY` — Brevo API key
- `EMAIL_USER` — sender email address
- `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET` — Cloudinary credentials
- `VITE_API_BASE_URL` — frontend base API URL (e.g., http://localhost:5001)

## Installation
1. Install root dependencies if any: `npm install`
2. Backend: `cd server` then `npm install`
3. Frontend: `cd client` then `npm install`

## Running Locally
- Start backend: `cd server && npm run dev` (or `node server.js`)
- Start frontend: `cd client && npm run dev`

## Scripts
Check `package.json` files in `client/` and `server/` for available scripts.

## Security Notes
- Never commit `.env` or any private keys. Rotate any keys that were committed previously.
- Add any discovered secrets to `.env` and remove them from Git history if necessary.

## Contributing
- Fork, create a branch, add changes, create a PR. Keep secrets out of commits.
