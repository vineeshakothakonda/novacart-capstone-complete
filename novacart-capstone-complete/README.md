# NovaCart — Full-Stack Web Development Capstone

NovaCart is a production-ready **frontend e-commerce capstone** designed for mentor evaluation. It combines live REST API integration, simulated authentication, interactive catalog controls, CRUD operations, persistent client state, responsive design, and deployment-ready configuration.

## Live deployment

**Live URL:** Add your Vercel/Netlify URL here after deployment.

**GitHub repository:** Add your public GitHub repository URL here after pushing.

> This ZIP contains the complete source. A public URL cannot be created from inside the chat because deployment requires your Vercel/Netlify/GitHub account authorization.

## Architecture

```text
┌───────────────────────────────┐
│           Browser             │
│  HTML + CSS + ES6 Modules     │
└───────────────┬───────────────┘
                │
       ┌────────▼────────┐
       │     app.js      │
       │ routing + events│
       └───┬─────────┬───┘
           │         │
     ┌─────▼───┐ ┌──▼─────────┐
     │  api.js │ │  state.js  │
     │ REST API│ │ client data│
     └─────┬───┘ └──┬─────────┘
           │        │
     ┌─────▼───┐ ┌──▼─────────┐
     │ FakeStore│ │ localStorage│
     │   API    │ │ persistence │
     └──────────┘ └────────────┘
```

## Capstone features

### Authentication simulation
- Sign in / create-account style flow
- User session persisted in localStorage
- Sign-out support
- No real passwords or sensitive credentials are stored

### Interactive catalog
- Live products loaded with `fetch()` and `async/await`
- Real-time search
- Category filtering
- Sorting by featured, price, rating, and name
- Responsive product cards
- Loading skeletons
- Friendly API failure handling

### Dynamic CRUD
- Create products
- Edit products
- Delete products
- Uses Fake Store API mutation endpoints
- Local persistence keeps CRUD changes usable even though the demo API is not a permanent database

### Shopping cart
- Add products
- Increase/decrease quantity
- Remove automatically at quantity zero
- Persistent localStorage state
- Total calculation
- Demo checkout

## Tech stack

- HTML5
- CSS3
- JavaScript ES6 modules
- Fetch API
- Fake Store API
- localStorage
- Vercel / Netlify compatible

## Folder structure

```text
novacart/
├── index.html
├── README.md
├── vercel.json
├── netlify.toml
├── css/
│   └── styles.css
├── js/
│   ├── api.js
│   ├── app.js
│   ├── auth.js
│   ├── state.js
│   ├── storage.js
│   └── ui.js
└── assets/
```

## Local setup

Because ES modules are used, serve the directory through a local HTTP server.

### VS Code
Use the Live Server extension and open `index.html`.

### Python
```bash
python -m http.server 5500
```
Open `http://localhost:5500`.

## Deploy to Vercel

1. Create a GitHub repository.
2. Push all files from this project.
3. Sign in to Vercel.
4. Import the GitHub repository.
5. Framework preset: **Other** / static.
6. Build command: leave empty.
7. Output directory: `.`
8. Deploy.
9. Copy the generated public URL into this README and your mentor submission.

## Deploy to Netlify

1. Push the project to GitHub.
2. Open Netlify and choose **Add new site → Import an existing project**.
3. Select GitHub and the repository.
4. Build command: leave empty.
5. Publish directory: `.`
6. Deploy.
7. Copy the generated URL into this README and mentor submission.

## GitHub commands

```bash
git init
git add .
git commit -m "feat: complete NovaCart capstone"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Evaluation checklist

- [x] Authentication simulation
- [x] REST API integration
- [x] Async/await
- [x] Search and filters
- [x] Sorting
- [x] CRUD operations
- [x] Persistent client state
- [x] Cart workflow
- [x] Loading skeleton
- [x] Error handling
- [x] Responsive design
- [x] Modular JavaScript
- [x] Architecture documentation
- [x] Vercel configuration
- [x] Netlify configuration
- [ ] Public GitHub repository URL
- [ ] Public live deployment URL

## Important production note

This capstone intentionally uses a public demo REST API and simulated authentication. For a real production e-commerce application, replace these with a secure backend, database, real authentication provider, server-side authorization, payment provider, validation, rate limiting, and secret management.
