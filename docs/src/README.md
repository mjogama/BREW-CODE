# Frontend source structure

## Folders

| Folder      | Purpose |
|------------|---------|
| **config/** | API base URL and endpoint paths. Use `api.js` for backend URLs. |
| **utils/**  | **Reusable functions** (validation, formatting, DOM helpers). Put shared logic here. |
| **js/**     | Page-specific scripts (login, signup, homepage, admin). |
| **styles/** | CSS (global, auth, admin, pages). |
| **pages/**  | HTML pages. |

## Where to put reusable functions

Use **`src/utils/`** for anything shared across pages, for example:

- `displayError.js` – show/clear validation messages
- Form helpers, date/string formatters, small DOM helpers, etc.

Import from page scripts like this:

```js
import displayError from "../utils/displayError.js";
```

## API endpoints (config/api.js)

Aligned with backend `be/src/routes/user.route.js`:

- `POST /api/user/signup`
- `POST /api/user/login`
- `GET /api/user` (customer, auth required)
- `GET /api/user/admin` (admin, auth required)

Use `getUrl(ENDPOINTS.user.login)` etc. so the base URL is in one place.
