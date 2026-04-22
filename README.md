# Lozells Central Mosque Website

A web application made for the community to enhance mosque operations. The project includes:

- A community portal with real-time prayer context, events, funeral notices, sermon archive, radio stream, donations, and feedback.
- An admin dashboard to update prayer times and publish new events, announcements or notices.
- Accessibility first approach with a simple design so users can understand
- Deployment and maintenance documentation making it easy to update whenever needed.

## Quick start

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/index.html`
- `http://localhost:8080/admin.html`

Admin demo access code: `mosque-admin`

## Project structure

- `index.html` – Homepage with editable information.
- `prayer-times.html`, `events.html`, `announcements.html`, `funerals.html`, `sermons.html`, `radio.html`, `donations.html`, `feedback.html` – feature specific public pages viewbale by all.
- `admin.html` – Content management by certain mosque members.
- `styles.css` – Responsive and accessible styling.
- `app.js` – Dynamic rendering, local data persistence, admin actions.
- `docs/system-design.md` – Architecture and core modules.
- `docs/database-schema.md` – Suggested production schema.
- `docs/user-manual.md` – End-user and instructions for admin
- `docs/maintenance-manual.md` – Support, backup, deployment, and operations guidance.
- `docs/deployment-guide.md` – Live hosting, domain, and SSL deployment steps.
