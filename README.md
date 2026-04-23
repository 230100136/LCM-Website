# Lozells Central Mosque Website

A web application made for the community to enhance mosque operations. The project includes:

- A community portal with real-time prayer context, events, funeral notices, sermon archive, radio stream, donations, and feedback.
- An admin dashboard to update prayer times and publish new events, announcements or notices.
- An accessibility focused approach with a simple design so all users can understand and access the system.

## Quick start

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/index.html`
- `http://localhost:8080/admin.html`

Admin demo access code: `mosque-admin`

## Project structure

- `index.html` – Homepage with editable information by admins.
- `prayer-times.html`, `events.html`, `announcements.html`, `funerals.html`, `sermons.html`, `radio.html`, `donations.html`, `feedback.html` – specific featured public pages viewbale by all.
- `admin.html` – Content management by certain mosque members.
- `styles.css` – Responsive and accessible styling.
- `app.js` – Dynamic rendering, local data persistence, admin actions.
