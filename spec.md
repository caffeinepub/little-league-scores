# Little League Scores

## Current State
- App shows game scores organized by 7 divisions via tabs
- Admins can add/edit/delete game records with optional MVP info
- Sidebar shows hardcoded upcoming games and league notices
- Backend stores GameRecord with scores, MVP info; uses authorization + blob-storage components

## Requested Changes (Diff)

### Add
- **Standings page/view**: Per-division standings table computed from completed game records. Columns: Team, W, L, T, Runs Scored, Runs Allowed. Sorted by wins descending.
- **Schedule feature**: Stored scheduled (upcoming) games managed by admins. ScheduledGame type: date, homeTeam, awayTeam, division. Backend: addScheduledGame, updateScheduledGame, deleteScheduledGame (admin), getAllScheduledGames (public).
- **Schedule UI**: Dedicated Schedule tab or section showing upcoming games per division. Admins can add/edit/delete scheduled games via a form dialog.
- **Top-level navigation**: Add "Scores", "Standings", and "Schedule" nav tabs/pages to the app.

### Modify
- Replace hardcoded UPCOMING_GAMES sidebar data with backend-fetched scheduled games
- Header updated to support page navigation between Scores, Standings, Schedule views

### Remove
- Hardcoded UPCOMING_GAMES array in ScoresPage

## Implementation Plan
1. Add ScheduledGame type to Motoko backend with full CRUD (admin write, public read)
2. Regenerate backend bindings
3. Add new hooks for schedule queries/mutations
4. Create StandingsPage component: derive W/L/T per team from game records per division
5. Create SchedulePage component with admin form dialog for managing scheduled games
6. Update App.tsx to support 3-page navigation (Scores / Standings / Schedule)
7. Update Header to render nav links
8. Replace sidebar upcoming games with live backend data
