# MoodBuds Auth UI

A responsive React + Vite frontend for the MoodBuds signup, OTP verification,
profile creation, and sign-in flow.

## Run locally

```bash
npm install
npm run dev
```

Vite runs at `http://localhost:5173` and proxies `/moodbudsv1` requests to
`http://localhost:8080`.

To use a different backend host, copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Expected backend routes

- `POST /moodbudsv1/signup`
- `POST /moodbudsv1/verifyotp`
- `POST /moodbudsv1/profilecreation`
- `POST /moodbudsv1/signin`

All requests include credentials so the Express session cookie is preserved
through the multi-step signup flow.
