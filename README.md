# Margin

A design reference library for DESN31927 Project 2 by Yinman Tang.
Save a source link with a discipline, optional project and design note. Search,
filter, edit, remove and undo removal. Shared classroom demonstration data.

## Local use

Install Node.js 22 or newer. Run `pnpm install` or `npm install`.
Set MONGODB_URI in the process environment or an ignored .env file, then run
`npm start`. On the author's Mac, `Start Margin.command` accepts the existing
Atlas URI at a hidden prompt and starts http://127.0.0.1:5051.

The application uses the dedicated `margin.references` collection.
MongoDB Atlas database permissions and network access must allow the server.

## Deploy to Netlify

The included netlify.toml publishes public/ and bundles the Express adapter
in netlify/functions/api.js. Set MONGODB_URI as a server-side environment
variable for Functions. It must never be added to public files or source control.
Node 22 is configured. Verify GET, POST, PUT and DELETE after deployment.

## Structure

- app.js defines Mongoose schema, connection and REST endpoints.
- server.js serves the same API and public frontend locally.
- public/ contains the HTML form, CSS and browser JavaScript.
- netlify/functions/api.js adapts Express for Netlify.
- docs/PROCESS.md records research, feature specification, schema and AI use.

## Scope and credits

This version is one shared collection with visitor editing. It has no account
separation. Original category graphics represent disciplines, not screenshots
of linked works. URLs always lead to original sources.

Architecture follows Harold Sikkema's course examples. Implementation and
process drafts were authored with Codex under the student's direction.
See docs/PROCESS.md for sources and decisions.
