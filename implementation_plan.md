# Phase 4: 🌍 Communities / Skill Hubs

This phase introduces "Hubs"—communities dedicated to specific skills or topics (e.g., "Frontend Developers", "Language Exchange"). Users can create, join, and browse Hubs to connect with like-minded individuals.

## Open Questions
> [!IMPORTANT]
> 1. Should Hubs have any specific functionality immediately (e.g., a discussion board or chat room), or just act as a member directory for finding peers? (The initial plan will implement a member directory).
> 2. Should any user be allowed to create a Hub, or should it be restricted? (The initial plan allows any authenticated user to create a Hub).

## Proposed Changes

### Backend Models
- [NEW] `backend/models/Hub.js`
  - Defines the `Hub` schema: `name`, `description`, `creator` (User), `members` (Array of Users), and timestamps.

### Backend Controllers & Routes
- [NEW] `backend/controllers/hubController.js`
  - `createHub`: Create a new Hub.
  - `getAllHubs`: Fetch all available Hubs.
  - `getHubById`: Fetch Hub details with populated members.
  - `joinHub`: Add the current user to a Hub.
  - `leaveHub`: Remove the current user from a Hub.
- [NEW] `backend/routes/hubRoutes.js`
  - Defines standard REST routing for the hub endpoints.
- [MODIFY] `backend/app.js`
  - Mount `/api/hubs` to the main express app.

### Frontend Services
- [NEW] `frontend/skill/src/services/hubService.js`
  - Axios calls to interact with the new Hub API endpoints.

### Frontend Pages & UI
- [NEW] `frontend/skill/src/pages/Hubs.jsx`
  - A glowing, aesthetic page listing all available Hubs as cards, with a modal/button to create new ones.
- [NEW] `frontend/skill/src/pages/HubDetails.jsx`
  - A dedicated page for a specific Hub showing its description and a grid of participating members.
- [MODIFY] `frontend/skill/src/components/Sidebar.jsx` & `Navbar.jsx`
  - Add navigation links pointing to `/hubs`.
- [MODIFY] `frontend/skill/src/App.jsx`
  - Register new routes for `/hubs` and `/hubs/:id`.

## Verification Plan
### Automated Tests
- Server start-up checks: `npm run dev` in backend to ensure no route syntax errors.
### Manual Verification
- Launch both backend and frontend servers.
- Use the UI to create a new Hub and ensure it appears in the list.
- Click "Join" on a Hub and verify the database and UI update accordingly.
- Navigate into a Hub to ensure the member list populates correctly.
