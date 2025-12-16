Frontend (Vercel)

1. Ensure repository pushed to GitHub.
2. In Vercel import project, select this repo.
3. Set Root Directory to `frontend` (or use the provided vercel.json).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_URL` -> `https://netflixcloneapp-1ehr.onrender.com/api`

Backend (Render)

1. Create a new Web Service on Render and connect to the same repo.
2. Set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (set to your Vercel URL)
6. Set Health Check Path: `/api/health`

After deploy

- Visit the Vercel frontend URL and check network requests point to your Render backend.
- If you get 400 from `/api/auth/login`, check Render logs for the request payload error and correct validation or client request shape.
