# Food App Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root of `food-back/` with:
   ```env
   JWT_SECRET=supersecretkey
   PORT=5000
   ```
3. Start the server:
   ```bash
   node index.js
   ```

## Endpoints

- `POST /api/login` — Login with `{ username, password }` (see mock users in `index.js`)
- `GET /api/protected` — Example protected route (requires `Authorization: Bearer <token>` header)
- `GET /api/dishes` — Public endpoint returning mock dishes

## Mock Users
- `user1` / `password1`
- `user2` / `password2` 