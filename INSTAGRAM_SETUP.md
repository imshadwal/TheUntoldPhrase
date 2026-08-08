# Instagram live feed setup (no Facebook Page)

Your `@theuntoldphrase` **Business** account works with **Instagram API with Instagram Login**.  
You do **not** need to connect Instagram to a Facebook Page.

Home loads posts via `/api/instagram-feed` using `graph.instagram.com`.

Official docs: [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/)

---

## What goes in `.env`

```env
IG_ACCESS_TOKEN=paste_instagram_user_token_here
IG_USER_ID=me
```

- Restart `npm run dev` after every `.env` change.
- Never commit `.env` (gitignored).

---

## Prerequisites (no Page)

1. Instagram account is already **Business** (or Creator) — you have this.
2. You can log into [developers.facebook.com](https://developers.facebook.com/) with a Meta developer account (any Facebook login used for the Meta app is fine; the **Instagram** account itself stays unlinked from a Page).

---

## 1. Create a Business-type Meta app

1. Go to [developers.facebook.com](https://developers.facebook.com/) → **My Apps** → **Create App**.
2. Choose **Business** as the app type (required for Instagram Login).
3. Name it e.g. `The Untold Phrase` → create.

## 2. Add Instagram (Instagram Login — not Facebook Login)

1. App dashboard → **Add products** → add **Instagram**.
2. Open **Instagram → API setup with Instagram business login** (wording may be “API setup with Instagram login”).
3. Follow the on-screen steps to add your Instagram professional account (`@theuntoldphrase`).
4. Request / enable permission: **`instagram_business_basic`** (enough to read media for the Home feed).

Do **not** choose the “Facebook Login / link a Page” path.

## 3. Generate a token in the App Dashboard (easiest)

1. Still under **Instagram → API setup with Instagram business login**.
2. Find your Instagram account and click **Generate token**.
3. Log into Instagram when prompted and approve access.
4. Copy the access token.

That token is an **Instagram User** access token — not a Facebook Page token.

Optional: implement [Business Login for Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/) OAuth later; dashboard “Generate token” is enough to start.

## 4. Confirm media works

In a browser or with curl (replace `TOKEN`):

```bash
curl "https://graph.instagram.com/v21.0/me?fields=user_id,username,account_type&access_token=TOKEN"
```

You should see `username` like `theuntoldphrase` and `account_type` Business / Creator.

Then:

```bash
curl "https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type,timestamp&limit=6&access_token=TOKEN"
```

If `/me/media` works, keep `IG_USER_ID=me`.  
If you got `user_id` from `/me`, you can also set `IG_USER_ID=` to that numeric id.

From the project (after pasting into `.env`):

```bash
cd tup-web
npm run ig:verify
```

## Token lifetime (important)

Dashboard **Generate token** values are usually **already long-lived (~60 days)**.

- Do **not** use `ig:exchange` on them (that fails with “invalid token type”).
- Use refresh instead, about once a month:

```bash
npm run ig:refresh
```

Your current setup was refreshed successfully and expires around **60 days** out.  
While `npm run dev` is running, the server also tries to auto-refresh when under ~10 days remain.

If the API is down or the token expires, Home falls back to the last cached posts in `data/instagram-cache.json`.

## 6. Wire into the site

```env
IG_ACCESS_TOKEN=IGQWR...
IG_USER_ID=me
```

```bash
cd tup-web
npm run ig:verify
npm run dev
```

Home → Instagram section should show **Live from Instagram**.

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| Asked to connect a Facebook Page | Wrong product path — use **API setup with Instagram business login**, not Facebook Login |
| App type error | Create a new Meta app and select **Business** |
| Invalid token | Regenerate under Instagram product; paste into `tup-web/.env`; restart Vite |
| Permission denied | Ensure `instagram_business_basic` is granted when approving Instagram Login |
| Empty feed note | `.env` empty or Vite not restarted |
| `ig:verify` fails on facebook.com host | Ignore — Instagram Login should succeed on `graph.instagram.com` first |

## Security

- Do not share tokens or app secrets.
- Do not commit `.env`.
- Rotate if leaked.
- **Never** prefix the token with `VITE_` — that would embed it in the browser bundle.
- The client only calls `/api/instagram-feed`; the token stays on the server (Vite middleware / future serverless function).
- Story **highlights are not available** via Instagram Login API. Brand logos on the site are curated in `src/content/brands.json` (seeded from tagged partners in recent posts). Update that file when highlights change.

---

## Note (Facebook Page path — not for you)

Linking a Facebook Page is only required for the older **Instagram API with Facebook Login**.  
You can ignore that path entirely while the account stays Business and unlinked from a Page.

## Sync profile logo

```bash
npm run ig:logo
```

Pulls the current Instagram DP into `public/images/logos/tup-logo.png`.
