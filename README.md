# Shack Trivia

A Jeopardy-style trivia board for live in-person events. No backend, no network — just a static SPA that reads questions from a CSV and lets the host run the game from one screen.

**Stack:** React + Vite, PapaParse, ShackWedding design system

---

## How it works

- Questions are loaded from `questions.csv` at the repo root
- The board renders a 5×6 grid (5 categories, 6 point values each)
- Clicking a cell opens a modal with the clue
- "Reveal Answer" toggles the answer text
- "Done" dismisses the modal and greys out that cell permanently (for the session)

---

## Editing questions

Open `questions.csv` and edit directly. Expected columns:

| Column     | Description                        |
|------------|------------------------------------|
| `ID`       | Unique identifier (any string/int) |
| `Category` | Column header on the board         |
| `Points`   | Numeric value (e.g. 100–600)       |
| `Question` | The clue shown to players          |
| `Answer`   | Revealed when host clicks the button |

The board groups rows by `Category` and sorts within each category by `Points` ascending. Any number of categories and point values work — just keep them consistent across categories so the grid stays rectangular.

---

## Development

```bash
npm install && npm run dev   # starts Vite dev server on :5173
```

---

## Deploy to Render

1. Push to GitHub
2. In Render, click **New > Blueprint** and connect the repo
3. Render detects `render.yaml` and deploys a static site — no env vars needed
