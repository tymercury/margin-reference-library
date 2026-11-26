# Margin: Process Record

Yinman Tang · DESN31927 · Project 2 · 26 November 2026

## Project and AI approach

Margin stores design references with original source links, design observations,
a discipline and an optional project. The student selected the idea, supplied
course materials and directed the interface and documentation revisions. Codex
authored code, sample notes and documentation drafts and performed the recorded
tests. See AI-USE.md for the note and prompt excerpts.

## Research and data collection

Bruce, Jones and Dumais’s keeping and re-finding research informed the focus on
retrieving useful sources later. Are.na informed contextual grouping; Raindrop
informed project-based organisation. Margin pairs every source with a required
design note. A single discipline and optional project keep the form short.
The initial library contains eight sample references with Codex-drafted notes.
See WORKS-CITED.md for MLA 9 references and annotations.

## Audience and features

The audience is a design student collecting references across assignments.
The use case diagram and feature specification connect five goals to the
interface and API: save, find/read, edit, remove and restore.

## Interface and schema

The form collects title, url, category, project and note. Title, url, category
and note are required. Mongoose validates lengths, the discipline enum and
public HTTP(S) URLs. The database generates _id and timestamps. __v supports
version checks; deletedAt supports recoverable removal.

The current interface begins with search, filters and Save. Source-and-note rows
show complete observations alongside discipline, project and editing actions.
Student feedback led to removing the hero, slogans and decorative category
artwork, and adopting one sans-serif system with a neutral palette.

## Technical implementation

HTML form → browser fetch → Vercel Express API → Mongoose → MongoDB Atlas.
The existing Cluster0 holds database margin and collection references.
Compass inspection confirms the stored fields and generated identity. GET,
POST, PUT and DELETE serve the full data lifecycle. Restore clears deletedAt.
The Netlify adapter is retained as a comparison with the course baseline.

MONGODB_URI is read by the server from its Production environment. It does not
appear in public/. .env and .vercel are excluded from Git. Bruno confirmed that
/.env and /server.js return 404 and the public API returns no connection string.
Reference data is intentionally shared through the API. Personal libraries
would require authentication and ownership checks on every record endpoint.

## Testing and problem solving

Week 09 explicitly asks for full API CRUD, frontend CRUD and a connected
architecture diagram. Mongoose and the CRUD iteration post guide the adaptation
of schema, form and display. A saved Bruno collection now verifies the deployed
API independently of the interface. Its 16 requests and 16 tests passed.

The frontend lifecycle was repeated on the current version. Compass queries
matched the edited frontend record and the Bruno record by ObjectId. Active
records matched the public library. Screenshots and reports are in evidence/;
TESTING.md records expected and actual results.

Atomic _id + __v checks reject stale edits with HTTP 409. deletedAt preserves
the document for Undo. Inline errors are linked with aria-describedby. A failed
library load has a retry action. fileURLToPath resolves the project directory
correctly when its path contains spaces.

An accidentally pasted connection string was removed during the earlier work.
The database password was rotated and the production configuration revalidated.

## Reflection and next steps

The movie exercise established a concrete example of persistence; its wrong-year
entry motivated correction through editing. The formal project adds a purpose
for each stored observation and a complete record lifecycle. Student critique
changed the interface’s information hierarchy. Next steps are to explain the
request/model mapping independently, evaluate retrieval with students, and add
accounts and record ownership for personal use.

## Submission

The 25-page process deck follows the brief’s sequence. Technical presentation
notes are attached to pages 10–15 and 19. The movie exercise is confined to the
appendix. Submission includes public, source and process URLs, a PDF process
record and a source ZIP with the Bruno collection.
