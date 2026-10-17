# List Shuffler: a Trello Power-Up

Adds **🎲 Shuffle cards** to the "…" menu of every list on a board.

## Files
| File | Purpose |
|---|---|
| `index.html` | Iframe connector Trello loads in the background |
| `client.js` | Registers the list action and does the shuffle |
| `authorize.html` | One-time popup that grants read/write access |
| `config.js` | Your API key goes here |

## Setup (about 15 minutes)

### 1. Host the files (GitHub Pages)
1. Create a new **public** GitHub repo, e.g. `trello-list-shuffler`.
2. Upload the four files to the root of the repo.
3. Go to **Settings → Pages**, set *Source* to `main` branch, root folder, and save.
4. Wait a minute. Your site is at `https://<your-username>.github.io/trello-list-shuffler/`.
   Open that URL to check it loads (it shows a blank page, which is expected).

### 2. Register the Power-Up
1. Go to **https://trello.com/power-ups/admin** (you must be a workspace admin).
2. Click **New**, then fill in:
   - **Workspace**: the one that holds your board
   - **Name**: List Shuffler
   - **Iframe connector URL**: `https://<your-username>.github.io/trello-list-shuffler/index.html`
   - Email and support contact: your own
3. Create it, then open the **Capabilities** tab and switch on **List actions**.

### 3. Get an API key
1. In the Power-Up's admin page, open the **API key** tab and click **Generate a new API key**.
2. Under **Allowed origins**, add `https://<your-username>.github.io`.
3. Copy the key into `config.js` (replace `PASTE_YOUR_API_KEY_HERE`), and commit the change.

### 4. Enable it on your board
1. On your board, open **Power-Ups → Add Power-Ups**, find **Custom** (left sidebar), then add **List Shuffler**.
2. Click any list's **…** menu, then **🎲 Shuffle cards**.
3. The first time, click **Authorize** and approve in the Trello window that opens. Then click Shuffle again.

## Notes
- **No undo.** Shuffling permanently changes the card order.
- Cards are updated 4 at a time with automatic retry on rate limits, so a 100-card list takes a few seconds.
- If you ever revoke the token (Trello → Settings → Applications), the Power-Up asks you to re-authorize.
- To change the menu label, edit `text:` in `client.js`.
