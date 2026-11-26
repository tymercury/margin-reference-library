# Week 09 review and project response

Reviewed in Microsoft Teams, IxD System Design Thurs 12pm–6pm J222, Week 09,
26 November 2026. Instructor posts dated 12 November 2026.

| Instructor material | What it establishes | Margin evidence |
| --- | --- | --- |
| Week 09 Review | API GET/POST/PUT/DELETE, frontend CRUD, connected architecture diagram | Bruno collection; current UI; system map |
| Resume Builder with Full CRUD Lifecycle | Shared classroom reference implementation of full data management | Express/Mongoose/Atlas adapted to reference records |
| Iterating with CRUD | Adapt the baseline for a different use case; title identifies schema, form and template iteration | Reference schema, five-field form, source-and-note display |
| Mongoose Schema Documentation | Model document structure, data types, validation and generated identity | app.js schema; invalid-field tests |
| Validation in the Browser | Constraint Validation API and checkValidity() | Required-field and URL feedback |
| Accessibility on the Web | aria-describedby relates fields and feedback | Labelled form and linked error messages |
| Black Boxes | Explain the internal system through its components and connections | Browser → Express → Mongoose → Atlas map |

The reviewed Week 09 posts do not explicitly mandate Bruno. Bruno verification
was added in response to the student’s classmate’s reminder. The video’s post,
title and linked repository were reviewed; a complete video transcript was not
available. Do not describe the entire recording as watched.

## Data location and access boundary

Cloud service: MongoDB Atlas, existing Cluster0.
Database: margin. Collection: references.
Evidence: mongoose.connect(..., { dbName: 'margin' }) and collection: 'references'
in app.js; an authenticated Atlas/Compass view where available; persisted API reads.

The browser sends JSON to /api/references. The Vercel function runs Express and
Mongoose, reads process.env.MONGODB_URI, and connects to Atlas. The connection
string is configured in the server’s Production environment, never in public/.
The public repository contains .env.example with an empty value and excludes
.env and .vercel. The static deployment only exposes public/ files.

Reference titles, links and notes are intentionally returned by the public API.
Hiding the database password does not make this shared library private. Personal
libraries would require login plus ownership checks on every read/write endpoint.
No sensitive personal data is collected for this demo.

## Verification package

Open bruno/ in Bruno, select Production, run the requests in sequence.
The collection uses only a public base URL; no database credentials are needed.
It creates one labelled verification record, checks reads and an update, verifies
validation and version-conflict responses, removes/restores the record, and cleans
it from the visible library using the existing recoverable-delete workflow.
Report and screenshots are stored under docs/evidence/.
