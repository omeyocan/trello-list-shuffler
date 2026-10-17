# List Shuffler (Trello Power-Up)

Adds ** 🎲 Shuffle cards** to the "…" menu of every list on a board.

## Files
| File | Purpose |
|---|---|
| `index.html` | Iframe connector Trello loads in the background |
| `client.js` | Registers the list action and does the shuffle |
| `authorize.html` | One-time popup that grants read/write access |
| `config.js` |  |

## Setup (about 15 minutes)

### Register the Power-Up in Trello:
1. Go to **https://trello.com/power-ups/admin** (you must be a workspace admin).
2. Click **New**, then fill in:
   - **Workspace**: the one that holds your board
   - **Name**: List Shuffler
   - **Iframe connector URL**: `https://omeyocan.github.io/trello-list-shuffler/index.html`
3. Create it, then open the **Capabilities** tab and switch on **List actions**.


### Enable it on your board
1. On your board, open **Power-Ups → Add Power-Ups**, find **Custom** (left sidebar), then add **List Shuffler**.
2. Click any list's **…** menu, then **🎲 Shuffle cards**.
3. The first time, click **Authorize** and approve in the Trello window that opens. Then click Shuffle again.

## Notes
- **No undo.** Shuffling permanently changes the card order.
- Cards are updated 4 at a time with automatic retry on rate limits, so a 100-card list takes a few seconds.
- If you ever revoke the token (Trello → Settings → Applications), the Power-Up asks you to re-authorize.